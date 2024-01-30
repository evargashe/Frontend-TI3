import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';

import HeaderAdmin from '../component/Admin/Header'
import Home from '../page/Admin/Home';
import EquiposSolicitados from '../page/Admin/HomeEquiposSolicitados';
import DevolucionEquipos from '../page/Admin/HomeDevolucionDeEquipos';
import AgregarEquipos from '../page/Admin/HomeAgregarEquipos';

import Reportes from '../page/Admin/HomeReportes';
import VerEquipos from '../page/Admin/HomeVerEquipos';
import CrearAdmin from '../page/Admin/HomeCrearAdmin';
function adminRoutes() {
  /* const token = localStorage.getItem('tokenAdmin') //const token = Cookies.get('token');

  if (!token) {
    // Si no hay token, redirige a la página de inicio de sesión
    return <Navigate to="/admin/login" />;
  } */
  return (
    <div>
      <HeaderAdmin />
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/equipos-solicitados" element={<EquiposSolicitados />} />
        <Route path="/devolucion-equipos" element={<DevolucionEquipos />} />
        <Route path="/ver-equipos" element={<VerEquipos />} />
        <Route path="/agregar-equipos" element={<AgregarEquipos />} />
        <Route path="/reportes" element={<Reportes />} />
        <Route path="/crear-admin" element={<CrearAdmin />} />
        <Route
          path="/*"
          element={<div><h1 className="text-center text-5xl font-bold">404 Not Found</h1></div>}
        />
      </Routes>
    </div>
  );
}

export default adminRoutes;
