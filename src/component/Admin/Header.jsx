import React, { useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
import Logo from '../../assets/ce-epcc.png';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAdmin } from '../../context/AdminContext';
import Swal from 'sweetalert2';

const styleLogo = {
    width: '48px', // Ajusta el ancho de la imagen
    height: '48px', // Ajusta la altura de la imagen
}

function Header(props) {
    const { adminId } = useAdmin();
    const navigate = useNavigate();
    const [loggingOut, setLoggingOut] = useState(false);

    const handleLogout = () => {
        // Mostrar el mensaje de "Cerrando sesión" usando toast
        toast.info('Sesión Cerrada Exitosamente...', {
            position: toast.POSITION.TOP_CENTER,
            autoClose: 2000, // Duración del mensaje en milisegundos (ajusta según tus necesidades)
        });

        // Limpiar el token de sesión al cerrar sesión
        localStorage.removeItem('adminToken');

        localStorage.setItem('logoutEventAdmin', Date.now().toString());

        // Configurar el estado para desactivar el botón después de mostrar el mensaje
        setLoggingOut(true);

        // Redirigir a la página de inicio de sesión o cualquier otra página deseada después de un tiempo
        setTimeout(() => {
            const isAdminLoggedIn = !!localStorage.getItem('adminToken');
            if (isAdminLoggedIn) {
                navigate('/admin/home');
            } else {
                navigate('/admin/login');
            }
        }, 2000); // Espera 2 segundos antes de redirigir (ajusta según tus necesidades)
    };

    const handleClick = () => {
        console.log('handleClick ejecutado',adminId);  // Agrega esta línea
        if (adminId === '65b547c848c86c75bce9c8e0') {
            // Redirige al usuario a la ruta 'crear-admin'
            navigate('/admin/crear-admin');
        } else {
            // Muestra la alerta de que no puede ingresar
            Swal.fire({
                icon: 'error',
                title: 'No puede ingresar a este ruta',
                text: 'Solo pueden ingresar los administrador principales',
            });
        }
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
                        <li><Link to="equipos-solicitados">Ver Equipos Solicitados</Link></li>
                        <li><Link to="devolucion-equipos">Devolucion de Equipos</Link></li>
                        <li><Link to="ver-equipos">Ver Equipos</Link></li>
                        <li><Link to="agregar-equipos">Agregar Equipos</Link></li>
                        <li><Link to="reportes">Reportes</Link></li>
                    </ul>
                </div>
                <div className="navbar-end">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="w-6 h-6 cursor-pointer"
                        onClick={handleClick}
                    >
                        <path d="M5.25 6.375a4.125 4.125 0 1 1 8.25 0 4.125 4.125 0 0 1-8.25 0ZM2.25 19.125a7.125 7.125 0 0 1 14.25 0v.003l-.001.119a.75.75 0 0 1-.363.63 13.067 13.067 0 0 1-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 0 1-.364-.63l-.001-.122ZM18.75 7.5a.75.75 0 0 0-1.5 0v2.25H15a.75.75 0 0 0 0 1.5h2.25v2.25a.75.75 0 0 0 1.5 0v-2.25H21a.75.75 0 0 0 0-1.5h-2.25V7.5Z" />
                    </svg>
                    <button
                        className="btn ml-2"
                        onClick={handleLogout}
                        disabled={loggingOut}
                    >
                        {loggingOut ? 'Cerrando sesión...' : 'Cerrar sesión'}
                    </button>
                </div>
            </div>

        </div>
    );
}

export default Header;