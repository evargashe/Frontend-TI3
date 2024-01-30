import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';

import Logo from '../../assets/ce-epcc.png';

const styleLogo = {
  width: '48px',
  height: '48px',
};

function HeaderClient() {
  const navigate = useNavigate();
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = () => {
    // Mostrar el mensaje de "Cerrando sesión" usando toast
    toast.info('Sesión Cerrada Exitosamente...', {
      position: toast.POSITION.TOP_CENTER,
      autoClose: 2000, // Duración del mensaje en milisegundos (ajusta según tus necesidades)
    });

    // Limpiar el token de sesión al cerrar sesión
    Cookies.remove('token');
    localStorage.removeItem('token');

    localStorage.setItem('logoutEvent', Date.now().toString());

    // Configurar el estado para desactivar el botón después de mostrar el mensaje
    setLoggingOut(true);

    // Redirigir a la página de inicio de sesión o cualquier otra página deseada después de un tiempo
    setTimeout(() => {
      const isAdminLoggedIn = !!localStorage.getItem('token');
      if (isAdminLoggedIn) {
        navigate('/client/home');
      } else {
        navigate('/login');
      }
    }, 2000); // Espera 2 segundos antes de redirigir (ajusta según tus necesidades)
  };

  return (
    <div>
      <div className="navbar bg-base-100">
        <div className="navbar-start">
          <Link to="home">
            <a className="btn btn-ghost normal-case text-xl">
              <img src={Logo} alt="Logo" style={styleLogo} />
            </a>
          </Link>
        </div>
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal p-0">
            <li><Link to="home">Home</Link></li>
            <li><Link to="horario">Ver Horario</Link></li>
            <li><Link to="reservar">Reservar</Link></li>
            <li><Link to="ver-equipos">Ver Equipos</Link></li>
          </ul>
        </div>
        <div className="navbar-end">
          <Link to="perfil"><a className="btn">Mi cuenta</a></Link>
          <button
            onClick={handleLogout}
            className="btn ml-2"
            disabled={loggingOut}
          >
            {loggingOut ? 'Cerrando sesión...' : 'Cerrar sesión'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default HeaderClient;
