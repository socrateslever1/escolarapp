import React, { useState } from 'react'
import { supabase } from '../supabaseClient'
import { Loader2, Upload } from 'lucide-react'

export default function PerfilGestorUpload({ usuario }: any) {
  const [uploadingFoto, setUploadingFoto] = useState(false)
  const [uploadingDoc, setUploadingDoc] = useState(false)
  const [erro, setErro] = useState<string | null>(null)
  const [ok, setOk] = useState<string | null>(null)

  const userId = usuario?.auth_user_id

  if (!userId) return null

  async function uploadArquivo(file: File, tipo: 'foto' | 'documento') {
    setErro(null)
    setOk(null)

    const fileExt = file.name.split('.').pop()
    const fileName = `${tipo}-${Date.now()}.${fileExt}`
    const filePath = `${userId}/${fileName}`

    try {
      if (tipo === 'foto') setUploadingFoto(true)
      if (tipo === 'documento') setUploadingDoc(true)

      const { error: uploadError } = await supabase.storage
        .from('gestores')
        .upload(filePath, file, {
          upsert: true,
        })

      if (uploadError) throw uploadError

      const { data } = supabase.storage
        .from('gestores')
        .getPublicUrl(filePath)

      const publicUrl = data.publicUrl

      const updatePayload =
        tipo === 'foto'
          ? { foto_url: publicUrl }
          : { documento_url: publicUrl }

      const { error: updateError } = await supabase
        .from('usuarios')
        .update(updatePayload)
        .eq('auth_user_id', userId)

      if (updateError) throw updateError

      setOk(`${tipo === 'foto' ? 'Foto' : 'Documento'} enviado com sucesso!`)
    } catch (err: any) {
      setErro(err.message || 'Erro no upload')
    } finally {
      setUploadingFoto(false)
      setUploadingDoc(false)
    }
  }

  return (
    <div className="space-y-6 mt-6">
      {erro && (
        <div className="text-rose-600 text-sm font-bold">
          {erro}
        </div>
      )}

      {ok && (
        <div className="text-emerald-600 text-sm font-bold">
          {ok}
        </div>
      )}

      {/* FOTO */}
      <div>
        <label className="block text-xs font-bold mb-2">
          Foto de Perfil
        </label>
        <label className="flex items-center gap-3 cursor-pointer bg-slate-100 px-4 py-3 rounded-xl hover:bg-slate-200 transition">
          {uploadingFoto ? (
            <Loader2 size={18} className="animate-spin" />
          ) : (
            <Upload size={18} />
          )}
          <span className="text-sm font-semibold">
            Enviar Foto
          </span>
          <input
            type="file"
            accept="image/*"
            hidden
            onChange={(e) => {
              if (e.target.files?.[0]) {
                uploadArquivo(e.target.files[0], 'foto')
              }
            }}
          />
        </label>
      </div>

      {/* DOCUMENTO */}
      <div>
        <label className="block text-xs font-bold mb-2">
          Documento (RG / CPF)
        </label>
        <label className="flex items-center gap-3 cursor-pointer bg-slate-100 px-4 py-3 rounded-xl hover:bg-slate-200 transition">
          {uploadingDoc ? (
            <Loader2 size={18} className="animate-spin" />
          ) : (
            <Upload size={18} />
          )}
          <span className="text-sm font-semibold">
            Enviar Documento
          </span>
          <input
            type="file"
            accept="application/pdf,image/*"
            hidden
            onChange={(e) => {
              if (e.target.files?.[0]) {
                uploadArquivo(e.target.files[0], 'documento')
              }
            }}
          />
        </label>
      </div>
    </div>
  )
}