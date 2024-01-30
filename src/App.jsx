import React, { useState, useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';

import HomeRoutes from './routes/homeRoutes';
import ClientRoutes from './routes/clientRoutes';
import AdminRoutes from './routes/adminRoutes';
import HomeLoginAdmin from './page/Home/HomeLoginAdmin';
import HomeResetAadmin from './page/Home/HomeResetAmin';
import HomeCambiarContraseñaAdmin from './page/Home/HomeCambiarContraseñaAdmin';

import { UserProvider } from './context/UserContext';
import { AdminProvider } from './context/AdminContext';
import { endOfToday } from 'date-fns';

const PrivateRouteAdmin = ({ element }) => {
  const adminToken = localStorage.getItem('adminToken');

  if (!adminToken) {
    return <Navigate to="/admin/login" replace={true} />;
  }

  return element;
};


const PrivateRouteClient = ({ element, redirectTo }) => {
  const isLoggedIn = !!localStorage.getItem('token'); //  const isLoggedIn = !!Cookies.get('token');
  return isLoggedIn ? element : <Navigate to={redirectTo} />;
};

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Verificar el estado de inicio de sesión aquí (puedes utilizar Cookies.get('token') u otras formas)
    const token = localStorage.getItem('token'); //    const token = Cookies.get('token');
    setIsLoggedIn(!!token);
  }, []);
  

  useEffect(() => {
    const handleStorageChange = (event) => {
      // Verificar si la ruta actual no comienza con '/admin'
      if (!window.location.pathname.startsWith('/admin')) {
        if (event.key === 'logoutEvent') {
          // Realizar acciones adicionales cuando se detecta el cierre de sesión en otra pestaña
          // Por ejemplo, puedes redirigir al usuario a la página de inicio de sesión
          window.location.href = '/login';
          //window.location.reload();
        }
      } else if(!window.location.pathname.startsWith('/client')) {
        if (event.key === 'logoutEventAdmin') {
          // Realizar acciones adicionales cuando se detecta el cierre de sesión en otra pestaña
          // Por ejemplo, puedes redirigir al usuario a la página de inicio de sesión
          window.location.href = '/admin/home';
          //window.location.reload();
        }
      }
    };
    // Agregar el evento de escucha
    window.addEventListener('storage', handleStorageChange);

    return () => {
      // Remover el evento de escucha al desmontar el componente
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);


  return (
    <AdminProvider>
      <UserProvider>
        <ToastContainer />
        <Router>
          <Routes>
            <Route path="/*" element={<HomeRoutes />} />
            <Route
              path="client/*"
              element={
                <PrivateRouteClient element={<ClientRoutes />} redirectTo="/login" />
              }
            />
            <Route
              path="admin/*"
              element={<PrivateRouteAdmin element={<AdminRoutes />} />}
            />
            <Route path="/admin/login" element={<HomeLoginAdmin />} />
            <Route path="/admin/reiniciar-admin" element={<HomeResetAadmin />} />
            <Route path="/admin/reset-password-admin/:token" element={<HomeCambiarContraseñaAdmin />} />

          </Routes>
        </Router>
      </UserProvider>
    </AdminProvider>
  );
}

export default App;
