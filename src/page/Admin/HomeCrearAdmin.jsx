import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import Logo from '../../assets/ce-epcc.png';
import styles from './styles/HomeCrearAdmin.module.css';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useUser } from '../../context/UserContext';
import axios from 'axios';

function CrearAdmin(props) {
    const [formData, setFormData] = useState({
        email: '',
    });

    const navigate = useNavigate();

    const limpiarFormulario = () => {
        setFormData({
            email: '',
        });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.email || !/^[^\s@]+@unsa\.edu\.pe$/.test(formData.email)) {
            toast.error('Correo Electrónico (debe tener el formato correcto {ej. cualquiera@unsa.edu.pe})', {
                position: toast.POSITION.BOTTOM_RIGHT,
                autoClose: 2000,
            });
        }

        try {
            await axios.post(`${import.meta.env.VITE_REACT_APP_API_KEY}/api/admin/generate-token`, { email: formData.email });
            toast.success('Correo con enlace enviado exitosamente', {
                position: toast.POSITION.BOTTOM_RIGHT,
                autoClose: 2000,
            });
            setTimeout(() => {
                limpiarFormulario();
            }, 2000);
        } catch (error) {
            console.error('Error al enviar el correo con el enlace:', error);
            // Notifica al usuario sobre el error
            toast.error('Error al enviar el correo con el enlace');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className={`${styles.hero} ${styles.heroContent} hero`}>
                <div className="hero-content flex-col lg:flex-row-reverse">
                    <div className={`${styles.card} card flex-shrink-0 w-full max-w-screen-xl h-full shadow-2xl bg-base-100`}>
                        <div className="text-center lg:text-center">
                            <a className="mx-auto flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={`${styles.logo} logo w-6 h-6`}>
                                    <path fillRule="evenodd" d="M18.685 19.097A9.723 9.723 0 0 0 21.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 0 0 3.065 7.097A9.716 9.716 0 0 0 12 21.75a9.716 9.716 0 0 0 6.685-2.653Zm-12.54-1.285A7.486 7.486 0 0 1 12 15a7.486 7.486 0 0 1 5.855 2.812A8.224 8.224 0 0 1 12 20.25a8.224 8.224 0 0 1-5.855-2.438ZM15.75 9a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" clipRule="evenodd" />
                                </svg>
                            </a>
                            <h1 className="text-3xl font-bold">Crear Administrador</h1>
                        </div>
                        <div className="card-body">
                            <div className={`${styles.formControl} form-control`}>
                                <label className="label">
                                    <span className="label-text">Correo</span>
                                </label>
                                <input
                                    type="text"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="usuario@unsa.edu.pe"
                                    className="input input-bordered"
                                />
                            </div>
                            <div className="col-span-2 text-center">
                                <button type="submit" className={`${styles.button} bg-blue-600 text-white rounded p-2`}>
                                    Enviar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    );
}

export default CrearAdmin;
