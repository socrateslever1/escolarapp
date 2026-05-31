
import React from 'react';
import { Outlet } from 'react-router-dom';

const GestorLayout: React.FC = () => {
  return (
    <div className="min-h-full bg-[#f8fafc]">
      <Outlet />
    </div>
  );
};

export default GestorLayout;
