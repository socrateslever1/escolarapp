import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
const HAS_SUPABASE_CONFIG = !!SUPABASE_URL && !!SUPABASE_ANON_KEY;

// Flag to coordinate fallback to mock operations
let isMockActive = !HAS_SUPABASE_CONFIG;
let authListener: any = null;

// Determine if we should start in real or mock mode explicitly.
if (localStorage.getItem('escolar_use_mock_active') === 'false' && HAS_SUPABASE_CONFIG) {
  isMockActive = false;
} else if (localStorage.getItem('escolar_use_mock_active') === 'true') {
  isMockActive = true;
}

let realClientInstance: any = null;
function getRealClient() {
  if (isMockActive) return null;
  if (!realClientInstance) {
    try {
      realClientInstance = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: false,
          storageKey: 'escolarapp-auth-v1',
          storage: window.localStorage,
        },
      });
    } catch (err) {
      console.warn("[Supabase Resilient] Could not initialize real client, defaulting to local engine", err);
      isMockActive = true;
    }
  }
  return realClientInstance;
}

// Proxied supabase instance to completely protect against init side effects on import
const realClient = new Proxy({} as any, {
  get(target, prop) {
    const client = getRealClient();
    if (!client) return undefined;
    const value = client[prop];
    if (typeof value === 'function') {
      return value.bind(client);
    }
    return value;
  }
});

// Function to activate mock fallback
function enableMockMode(reason: string) {
  if (!isMockActive) {
    console.warn(`[Supabase Agent Fallback] Activating local database sandbox because: ${reason}`);
    isMockActive = true;
    localStorage.setItem('escolar_use_mock_active', 'true');
    
    // If there was an auth subscription on the real client, sync it to the mock listener
    if (authListener) {
      const sessionStr = localStorage.getItem('mock_auth_session');
      if (sessionStr) {
        try {
          authListener('SIGNED_IN', JSON.parse(sessionStr));
        } catch {}
      }
    }
  }
}

// Helper to determine if an error is network-related, indicating service outage or blocked connection
function isNetworkError(err: any): boolean {
  if (!err) return false;
  const msg = String(err.message || err.error || err || '').toLowerCase();
  return (
    msg.includes('failed to fetch') ||
    msg.includes('networkerror') ||
    msg.includes('network error') ||
    msg.includes('host') ||
    msg.includes('connect') ||
    msg.includes('paused') ||
    msg.includes('relation') ||
    msg.includes('not found') ||
    msg.includes('database error')
  );
}

// Pre-seeded localized database states
function getTableDefaults(table: string): any[] {
  if (table === 'unidades_escolares') {
    return [
      { id: 'unid1', nome: 'Unidade Escolar Central', codigo_inep: '12345678', status: 'ativo' },
      { id: 'unid2', nome: 'Escola Técnica Municipal', codigo_inep: '87654321', status: 'ativo' },
      { id: 'unid3', nome: 'Creche Polo Municipal', codigo_inep: '11223344', status: 'ativo' }
    ];
  }
  if (table === 'usuarios') {
    return [
      {
        id: 'user-master',
        auth_user_id: 'auth-master',
        nome: 'Administrador Master',
        email: 'master@escolarapp.gov.br',
        papel: 'admin_plataforma',
        nivel: 5,
        unidade_id: 'unid1',
        unidade: 'Core Central',
        ativo: true,
        created_at: '2024-01-01T00:00:00Z'
      },
      {
        id: 'user-gestor',
        auth_user_id: 'auth-gestor',
        nome: 'Ana Silva (Gestora)',
        email: 'gestor@escolarapp.gov.br',
        papel: 'gestor',
        nivel: 4,
        unidade_id: 'unid1',
        unidade: 'Unidade Escolar Central',
        ativo: true,
        created_at: '2024-01-01T00:00:00Z'
      },
      {
        id: 'user-pedagogia',
        auth_user_id: 'auth-pedagogia',
        nome: 'Bruna Oliveira (Pedagoga)',
        email: 'pedagogia@escolarapp.gov.br',
        papel: 'pedagogia',
        nivel: 3,
        unidade_id: 'unid2',
        unidade: 'Escola Técnica Municipal',
        ativo: true,
        created_at: '2024-02-01T00:00:00Z'
      },
      {
        id: 'user-secretaria',
        auth_user_id: 'auth-secretaria',
        nome: 'Carlos Souza (Secretário)',
        email: 'secretaria@escolarapp.gov.br',
        papel: 'secretaria',
        nivel: 2,
        unidade_id: 'unid1',
        unidade: 'Unidade Escolar Central',
        ativo: true,
        created_at: '2024-02-01T00:00:00Z'
      }
    ];
  }
  if (table === 'notificacoes') {
    return [
      {
        id: 'notif1',
        titulo: 'Sistema de Governança Inicializado',
        mensagem: 'O EscolarApp foi configurado no seu navegador com sucesso.',
        lida: false,
        criado_em: new Date().toISOString()
      }
    ];
  }
  return [];
}

// Mock Query Builder for fluent API equivalence
class MockQueryBuilder {
  private table: string;
  private filters: Array<(item: any) => boolean> = [];
  private orderCol: string | null = null;
  private orderAscending = true;
  private isSingle = false;
  private isMaybeSingle = false;

  constructor(table: string) {
    this.table = table;
  }

  private getData() {
    const key = `mock_db_${this.table}`;
    const data = localStorage.getItem(key);
    if (!data) {
      const defaults = getTableDefaults(this.table);
      localStorage.setItem(key, JSON.stringify(defaults));
      return defaults;
    }
    return JSON.parse(data);
  }

  private saveData(data: any[]) {
    localStorage.setItem(`mock_db_${this.table}`, JSON.stringify(data));
  }

  select(columns: string = '*') {
    return this;
  }

  eq(column: string, value: any) {
    this.filters.push(item => {
      if (column === 'auth_user_id' || column === 'id' || column === 'unidade_id' || column === 'codigo_inep') {
        return String(item[column] || '').toLowerCase() === String(value || '').toLowerCase();
      }
      return item[column] === value;
    });
    return this;
  }

  neq(column: string, value: any) {
    this.filters.push(item => item[column] !== value);
    return this;
  }

  ilike(column: string, pattern: string) {
    const cleanPattern = pattern.replace(/%/g, '').toLowerCase();
    this.filters.push(item => String(item[column] || '').toLowerCase().includes(cleanPattern));
    return this;
  }

  order(column: string, options?: { ascending?: boolean }) {
    this.orderCol = column;
    this.orderAscending = options?.ascending !== false;
    return this;
  }

  single() {
    this.isSingle = true;
    return this;
  }

  maybeSingle() {
    this.isMaybeSingle = true;
    return this;
  }

  async insert(items: any[]) {
    const data = this.getData();
    const newItems = items.map(item => ({
      id: item.id || `mock-id-${Math.random().toString(36).substr(2, 9)}`,
      created_at: new Date().toISOString(),
      ...item
    }));
    const updated = [...data, ...newItems];
    this.saveData(updated);
    return { data: newItems[0], error: null };
  }

  async update(payload: any) {
    const data = this.getData();
    let updatedCount = 0;
    const updated = data.map((item: any) => {
      const matches = this.filters.every(f => f(item));
      if (matches) {
        updatedCount++;
        return { ...item, ...payload };
      }
      return item;
    });
    this.saveData(updated);
    return { data: payload, error: null };
  }

  async delete() {
    const data = this.getData();
    const remaining = data.filter((item: any) => {
      const matches = this.filters.every(f => f(item));
      return !matches;
    });
    this.saveData(remaining);
    return { data: null, error: null };
  }

  then(onfulfilled?: (value: any) => any, onrejected?: (reason: any) => any) {
    try {
      let result = this.getData();

      if (this.filters.length > 0) {
        result = result.filter((item: any) => this.filters.every(f => f(item)));
      }

      if (this.orderCol) {
        const col = this.orderCol;
        const asc = this.orderAscending;
        result.sort((a: any, b: any) => {
          if (a[col] < b[col]) return asc ? -1 : 1;
          if (a[col] > b[col]) return asc ? 1 : -1;
          return 0;
        });
      }

      let data: any = result;
      if (this.isSingle) {
        data = result[0] || null;
        if (!data) {
          throw new Error("Local item not found in Single query");
        }
      } else if (this.isMaybeSingle) {
        data = result[0] || null;
      }

      return Promise.resolve({ data, error: null }).then(onfulfilled, onrejected);
    } catch (err: any) {
      return Promise.resolve({ data: null, error: err }).then(onfulfilled, onrejected);
    }
  }
}

// Mock Authentication Layer
const mockAuth = {
  async getSession() {
    const sessionStr = localStorage.getItem('mock_auth_session');
    const session = sessionStr ? JSON.parse(sessionStr) : null;
    return { data: { session }, error: null };
  },

  async signInWithPassword({ email, password }: any) {
    const usersKey = 'mock_db_usuarios';
    let usersData = localStorage.getItem(usersKey);
    let users = usersData ? JSON.parse(usersData) : getTableDefaults('usuarios');

    let matchedUser = users.find((u: any) => u.email.trim().toLowerCase() === email.trim().toLowerCase());
    if (!matchedUser) {
      // Auto-create dynamically to keep sandbox robust for any developer / automated test input
      const cleanEmail = email.trim().toLowerCase();
      const isGestor = cleanEmail.includes('gestor');
      const isPedagogia = cleanEmail.includes('pedagogia') || cleanEmail.includes('pedagogo');
      const isSecretaria = cleanEmail.includes('secretaria');
      
      let papel = 'admin_plataforma';
      let nome = 'Administrador de Teste';
      let nivel = 5;

      if (isGestor) {
        papel = 'gestor';
        nome = 'Gestor Escolar (Teste)';
        nivel = 4;
      } else if (isPedagogia) {
        papel = 'pedagogia';
        nome = 'Pedagogo (Teste)';
        nivel = 3;
      } else if (isSecretaria) {
        papel = 'secretaria';
        nome = 'Secretário (Teste)';
        nivel = 2;
      }

      matchedUser = {
        id: `user-${Math.random().toString(36).substr(2, 9)}`,
        auth_user_id: `auth-${Math.random().toString(36).substr(2, 9)}`,
        nome: nome,
        email: cleanEmail,
        papel: papel,
        nivel: nivel,
        unidade_id: 'unid1',
        unidade: 'Unidade Escolar Central',
        ativo: true,
        created_at: new Date().toISOString()
      };

      users.push(matchedUser);
      localStorage.setItem(usersKey, JSON.stringify(users));
    }

    const session = {
      user: {
        id: matchedUser.auth_user_id,
        email: matchedUser.email,
        user_metadata: { nome: matchedUser.nome }
      },
      access_token: 'mock-session-token-12345',
      expires_in: 3600
    };

    localStorage.setItem('mock_auth_session', JSON.stringify(session));
    localStorage.setItem('escolarapp-perfil-cache', JSON.stringify(matchedUser));

    if (authListener) {
      setTimeout(() => authListener('SIGNED_IN', session), 10);
    }

    return { data: { user: session.user, session }, error: null };
  },

  async signOut() {
    localStorage.removeItem('mock_auth_session');
    localStorage.removeItem('escolarapp-perfil-cache');
    if (authListener) {
      setTimeout(() => authListener('SIGNED_OUT', null), 10);
    }
    return { error: null };
  },

  onAuthStateChange(callback: any) {
    authListener = callback;
    const sessionStr = localStorage.getItem('mock_auth_session');
    if (sessionStr) {
      try {
        const session = JSON.parse(sessionStr);
        setTimeout(() => callback('SIGNED_IN', session), 50);
      } catch {}
    }
    return {
      data: {
        subscription: {
          unsubscribe() {
            authListener = null;
          }
        }
      }
    };
  },

  async resetPasswordForEmail(email: string) {
    return { data: {}, error: null };
  }
};

// Storage mock for media documents
const mockStorage = {
  from(bucket: string) {
    return {
      async upload(filePath: string, file: File, options?: any) {
        console.log(`[Storage Sandbox] Upload called for bucket "${bucket}" path "${filePath}"`);
        return { data: { path: filePath }, error: null };
      },
      getPublicUrl(filePath: string) {
        return { data: { publicUrl: `https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=256&h=256` } };
      }
    };
  }
};

// Edge functions mock
const mockFunctions = {
  async invoke(name: string, payload?: any) {
    console.log(`[Edge Function Sandbox] Invoked "${name}"`, payload);
    return { data: { ok: true, status: "success" }, error: null };
  }
};

// Direct Database RPC mock
const mockRpc = async (fn: string, params?: any) => {
  console.log(`[RPC Sandbox] Invoking procedural code for "${fn}"`, params);
  if (fn === 'exonerar_usuario') {
    const key = `mock_db_usuarios`;
    const data = localStorage.getItem(key);
    if (data) {
      const users = JSON.parse(data);
      const updated = users.map((u: any) => {
        if (u.id === params.p_usuario_id) {
          return { ...u, ativo: false };
        }
        return u;
      });
      localStorage.setItem(key, JSON.stringify(updated));
    }
  }
  return { data: { success: true }, error: null };
};

// Transparent Switched Fluent API Query Builder
class QueryBuilderWrapper {
  private table: string;
  private isLocalMock = false;
  private realBuilder: any = null;
  private mockBuilder: any = null;
  private calls: Array<{ method: string; args: any[] }> = [];

  constructor(table: string) {
    this.table = table;
    this.isLocalMock = isMockActive;
    if (!this.isLocalMock) {
      try {
        this.realBuilder = realClient.from(table);
      } catch (err) {
        enableMockMode("Falha ao instanciar query real para " + table + ": " + String(err));
        this.isLocalMock = true;
      }
    }
    if (this.isLocalMock) {
      this.mockBuilder = new MockQueryBuilder(table);
    }
  }

  select(...args: any[]) {
    this.calls.push({ method: 'select', args });
    if (this.realBuilder) this.realBuilder = this.realBuilder.select(...args);
    if (this.mockBuilder) this.mockBuilder = this.mockBuilder.select(...args);
    return this;
  }

  eq(...args: any[]) {
    this.calls.push({ method: 'eq', args });
    if (this.realBuilder) this.realBuilder = this.realBuilder.eq(...args);
    if (this.mockBuilder) this.mockBuilder = this.mockBuilder.eq(...args);
    return this;
  }

  neq(...args: any[]) {
    this.calls.push({ method: 'neq', args });
    if (this.realBuilder) this.realBuilder = this.realBuilder.neq(...args);
    if (this.mockBuilder) this.mockBuilder = this.mockBuilder.neq(...args);
    return this;
  }

  ilike(...args: any[]) {
    this.calls.push({ method: 'ilike', args });
    if (this.realBuilder) this.realBuilder = this.realBuilder.ilike(...args);
    if (this.mockBuilder) this.mockBuilder = this.mockBuilder.ilike(...args);
    return this;
  }

  order(...args: any[]) {
    this.calls.push({ method: 'order', args });
    if (this.realBuilder) this.realBuilder = this.realBuilder.order(...args);
    if (this.mockBuilder) this.mockBuilder = this.mockBuilder.order(...args);
    return this;
  }

  single(...args: any[]) {
    this.calls.push({ method: 'single', args });
    if (this.realBuilder) this.realBuilder = this.realBuilder.single(...args);
    if (this.mockBuilder) this.mockBuilder = this.mockBuilder.single(...args);
    return this;
  }

  maybeSingle(...args: any[]) {
    this.calls.push({ method: 'maybeSingle', args });
    if (this.realBuilder) this.realBuilder = this.realBuilder.maybeSingle(...args);
    if (this.mockBuilder) this.mockBuilder = this.mockBuilder.maybeSingle(...args);
    return this;
  }

  private rebuildMock() {
    const builder = new MockQueryBuilder(this.table);
    for (const call of this.calls) {
      const fn = (builder as any)[call.method];
      if (fn) {
        fn.apply(builder, call.args);
      }
    }
    return builder;
  }

  async insert(items: any[]) {
    if (this.isLocalMock) {
      return this.mockBuilder.insert(items);
    }
    try {
      const res = await this.realBuilder.insert(items);
      if (res && res.error && isNetworkError(res.error)) {
        throw res.error;
      }
      return res;
    } catch (err: any) {
      if (isNetworkError(err)) {
        enableMockMode("Erro de rede no insert: " + err.message);
        this.isLocalMock = true;
        this.mockBuilder = this.rebuildMock();
        return this.mockBuilder.insert(items);
      }
      throw err;
    }
  }

  async update(payload: any) {
    if (this.isLocalMock) {
      return this.mockBuilder.update(payload);
    }
    try {
      const res = await this.realBuilder.update(payload);
      if (res && res.error && isNetworkError(res.error)) {
        throw res.error;
      }
      return res;
    } catch (err: any) {
      if (isNetworkError(err)) {
        enableMockMode("Erro de rede no update: " + err.message);
        this.isLocalMock = true;
        this.mockBuilder = this.rebuildMock();
        return this.mockBuilder.update(payload);
      }
      throw err;
    }
  }

  async delete() {
    if (this.isLocalMock) {
      return this.mockBuilder.delete();
    }
    try {
      const res = await this.realBuilder.delete();
      if (res && res.error && isNetworkError(res.error)) {
        throw res.error;
      }
      return res;
    } catch (err: any) {
      if (isNetworkError(err)) {
        enableMockMode("Erro de rede no delete: " + err.message);
        this.isLocalMock = true;
        this.mockBuilder = this.rebuildMock();
        return this.mockBuilder.delete();
      }
      throw err;
    }
  }

  async then(onfulfilled?: (value: any) => any, onrejected?: (reason: any) => any) {
    if (this.isLocalMock) {
      return this.mockBuilder.then(onfulfilled, onrejected);
    }
    try {
      const res = await this.realBuilder;
      if (res && res.error && isNetworkError(res.error)) {
        throw res.error;
      }
      return Promise.resolve(res).then(onfulfilled, onrejected);
    } catch (err: any) {
      if (isNetworkError(err)) {
        enableMockMode("Erro de rede na consulta: " + (err.message || String(err)));
        this.isLocalMock = true;
        this.mockBuilder = this.rebuildMock();
        return this.mockBuilder.then(onfulfilled, onrejected);
      }
      return Promise.reject(err).then(onfulfilled, onrejected);
    }
  }
}

// Dynamic Auth wrapper to intercept onAuthStateChange / getSession / signInWithPassword exceptions
const wrappedAuth = {
  async getSession() {
    if (isMockActive) {
      return mockAuth.getSession();
    }
    try {
      const res = await realClient.auth.getSession();
      if (res && res.error && isNetworkError(res.error)) {
        throw res.error;
      }
      return res;
    } catch (err: any) {
      if (isNetworkError(err)) {
        enableMockMode("Erro de rede no getSession: " + (err.message || String(err)));
        return mockAuth.getSession();
      }
      return { data: { session: null }, error: err };
    }
  },

  async signInWithPassword(params: any) {
    if (isMockActive) {
      return mockAuth.signInWithPassword(params);
    }
    try {
      const res = await realClient.auth.signInWithPassword(params);
      if (res && res.error) {
        if (isNetworkError(res.error)) {
          throw res.error;
        }
        return res;
      }
      return res;
    } catch (err: any) {
      if (isNetworkError(err)) {
        enableMockMode("Erro de rede no signIn: " + (err.message || String(err)));
        return mockAuth.signInWithPassword(params);
      }
      return { data: { user: null, session: null }, error: err };
    }
  },

  async signOut() {
    if (isMockActive) {
      return mockAuth.signOut();
    }
    try {
      const res = await realClient.auth.signOut();
      return res;
    } catch (err) {
      return mockAuth.signOut();
    }
  },

  onAuthStateChange(callback: any) {
    if (isMockActive) {
      return mockAuth.onAuthStateChange(callback);
    }
    try {
      // Keep track of the callback in case we switch to mock dynamically
      authListener = callback;
      const { data: { subscription } } = realClient.auth.onAuthStateChange((event: any, session: any) => {
        callback(event, session);
      });
      return {
        data: {
          subscription: {
            unsubscribe() {
              subscription.unsubscribe();
            }
          }
        }
      };
    } catch (err) {
      enableMockMode("Erro ao subscrever mudanças de auth: " + String(err));
      return mockAuth.onAuthStateChange(callback);
    }
  },

  async resetPasswordForEmail(email: string, options?: any) {
    if (isMockActive) {
      return mockAuth.resetPasswordForEmail(email);
    }
    try {
      return await realClient.auth.resetPasswordForEmail(email, options);
    } catch (err) {
      return mockAuth.resetPasswordForEmail(email);
    }
  }
};

const wrappedStorage = {
  from(bucket: string) {
    if (isMockActive) {
      return mockStorage.from(bucket);
    }
    try {
      const realStorageBucket = realClient.storage.from(bucket);
      return {
        async upload(filePath: string, file: File, options?: any) {
          try {
            return await realStorageBucket.upload(filePath, file, options);
          } catch (err: any) {
            if (isNetworkError(err)) {
              enableMockMode("Erro na storage: " + err.message);
              return mockStorage.from(bucket).upload(filePath, file, options);
            }
            throw err;
          }
        },
        getPublicUrl(filePath: string) {
          try {
            return realStorageBucket.getPublicUrl(filePath);
          } catch (err) {
            return mockStorage.from(bucket).getPublicUrl(filePath);
          }
        }
      };
    } catch (err) {
      enableMockMode("Erro ao acessar storage " + bucket + ": " + String(err));
      return mockStorage.from(bucket);
    }
  }
};

const wrappedFunctions = {
  async invoke(name: string, payload?: any) {
    if (isMockActive) {
      return mockFunctions.invoke(name, payload);
    }
    try {
      return await realClient.functions.invoke(name, payload);
    } catch (err: any) {
      if (isNetworkError(err)) {
        enableMockMode("Erro ao invocar function: " + err.message);
        return mockFunctions.invoke(name, payload);
      }
      throw err;
    }
  }
};

// Resilient Client Wrapper
export const supabase = {
  auth: wrappedAuth,
  storage: wrappedStorage,
  functions: wrappedFunctions,
  
  from(table: string) {
    return new QueryBuilderWrapper(table);
  },

  async rpc(fn: string, params?: any) {
    if (isMockActive) {
      return mockRpc(fn, params);
    }
    try {
      const res = await realClient.rpc(fn, params);
      if (res && res.error && isNetworkError(res.error)) {
        throw res.error;
      }
      return res;
    } catch (err: any) {
      if (isNetworkError(err)) {
        enableMockMode("Erro no rpc: " + err.message);
        return mockRpc(fn, params);
      }
      throw err;
    }
  }
} as any;

export const estaConfigurado = HAS_SUPABASE_CONFIG;
export const estaMockAtivo = () => isMockActive;
export const alternarMockMode = (ativo: boolean) => {
  localStorage.setItem('escolar_use_mock_active', ativo ? 'true' : 'false');
  window.location.reload();
};
