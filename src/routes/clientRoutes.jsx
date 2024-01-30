import React, { useEffect } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';

import HeaderClient from '../component/Cliente/Header';
import HomeClient from '../page/Cliente/Home';
import HorarioClient from '../page/Cliente/HomeHorario';
import ReservarClient from '../page/Cliente/HomeReservar';
import VerEquipos from '../page/Cliente/HomeVerEquipo';
import Perfil from '../page/Cliente/HomePerfil';

import { useUser } from '../context/UserContext';

function ClientRoutes() {

  const { userId } = useUser();
  const token = localStorage.getItem('token') //const token = Cookies.get('token');

  if (!token) {
    // Si no hay token, redirige a la página de inicio de sesión
    return <Navigate to="/login" />;
  }

  return (
    <div>
      <HeaderClient />
        <Routes>
          <Route
            path="/home"
            element={
              <HomeClient userId={userId} />
            }
          />
          <Route
            path="/horario"
            element={
              <HorarioClient userId={userId} />
            }
          />
          <Route
            path="/reservar"
            element={
              <ReservarClient userId={userId} />
            }
          />
          <Route
            path="/ver-equipos"
            element={
              <VerEquipos userId={userId} />
            }
          />
          <Route
            path="/perfil"
            element={
              <Perfil userId={userId} />
            }
          />

          <Route
            path="/*"
            element={<div><h1 className="text-center text-5xl font-bold">404 Not Found</h1></div>}
          />
        </Routes>
    </div>
  );
}

export default ClientRoutes;
