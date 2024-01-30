import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import HeaderHome from '../component/Home/Header';
import Home from '../page/Home/Home';
import Login from '../page/Home/HomeLogin';
import Register from '../page/Home/HomeRegister';
import Reset from '../page/Home/HomeReset';
import Horario from '../page/Home/HomeVerHorario';
import CambiarContraseña from '../page/Home/HomeCambiarContraseña';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import RegistroAdmin from '../page/Home/HomeRegistroAdmin';
import { useLocation } from 'react-router-dom';

function HomeRoutes() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

  // Verifica si la ruta actual es "registro-admin/:token"
  const hideHeaderInRegistroAdmin = location.pathname.includes('registro-admin/');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      if (!hideHeaderInRegistroAdmin) {
        navigate('/client/home');
      }
    } else {
      localStorage.removeItem('loginEvent');
    }
  }, [navigate]);

  useEffect(() => {
    const adminToken = localStorage.getItem('adminToken');
    if (adminToken) {
      setIsAdminLoggedIn(true);
    } else {
      localStorage.removeItem('loginEvent');
    }
  }, []);


  return (
    <div>
      {!hideHeaderInRegistroAdmin && <HeaderHome />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="ver-horario" element={<Horario />} />
        <Route path="login" element={<Login />} />
        <Route path="registrar" element={<Register />} />
        <Route path="reiniciar" element={<Reset />} />
        <Route path="reset-password/:token" element={<CambiarContraseña />} />
        <Route path="registro-admin/:token" element={<RegistroAdmin />} />

        <Route
          path="*"
          /*           element={<div><h1 className="text-center text-5xl font-bold">404 Not Found</h1></div>}*/
          element={<Navigate to="/" />}
        />
      </Routes>
    </div>
  );
}

export default HomeRoutes;
