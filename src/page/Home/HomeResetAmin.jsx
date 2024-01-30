import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Logo from '../../assets/ce-epcc.png';
import styles from './styles/HomeResetAdmin.module.css';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

function ResetPassword() {
    const [formData, setFormData] = useState({
        email: '',
    });


    const limpiarFormulario = () => {
        setFormData({
            email: '',
        });
    };
    const validarCorreoElectronico = (correo) => {
        const regexCorreo = /^[^\s@]+@unsa\.edu\.pe$/;
        return regexCorreo.test(correo);
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

        if (formData.email === '') {
            toast.error('Por favor, ingrese el correo electrónico.', {
                position: toast.POSITION.BOTTOM_RIGHT,
                autoClose: 1000,
            });
            return;
        }

        if (!validarCorreoElectronico(formData.email)) {
            toast.error('Correo Electrónico (debe tener el formato correcto {ej. cualquiera@unsa.edu.pe}).', {
                position: toast.POSITION.BOTTOM_RIGHT,
                autoClose: 1000,
            });
            return;
        }

        try {
            const response = await axios.post('http://localhost:4000/api/admin/reset-password-admin', {
                email: formData.email,
            });

            if (response.status === 200) {
                toast.success('Solicitud de cambio de contraseña enviada correctamente. Revisa tu correo electrónico.', {
                    position: toast.POSITION.BOTTOM_RIGHT,
                    autoClose: 3000,
                });
            } else {
                toast.error('Error al enviar la solicitud de cambio de contraseña.', {
                    position: toast.POSITION.BOTTOM_RIGHT,
                    autoClose: 3000,
                });
            }

            setTimeout(() => {
                limpiarFormulario();
                // Redirige a la página deseada después del inicio de sesión
                //navigate('/client/home'); // Ajusta la ruta según tus necesidades
            }, 1000);
        } catch (error) {
            toast.error('No existe el correo electronico.', {
                position: toast.POSITION.BOTTOM_RIGHT,
                autoClose: 3000,
            });
        }
    }



    return (
        <div className={`${styles.hero} ${styles.blackBackground} hero min-h-screen bg-base-200`}>
            <div className="hero-content flex-col lg:flex-row-reverse">
                <div className={`${styles.card} card flex-shrink-0 w-full max-w-screen-xl h-full shadow-2xl bg-base-100`}>
                    <div className="max-w-screen-xl mx-auto">
                        <div className="text-center lg:text-center">
                            <a className="mx-auto flex items-center justify-center">
                                <img src={Logo} alt="Logo" className={`${styles.logo} logo`} />
                            </a>
                            <h1 className="text-2xl font-bold">SOLICITAR CAMBIO DE CONTRASEÑA</h1>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Correo</span>
                                </label>
                                <div>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full p-3 border border-gray-300 rounded-lg"
                                        placeholder="ej. usuario@unsa.edu.pe"

                                    />
                                </div>
                            </div>
                            <div className="text-center mt-4">
                                <button type="submit" className={`${styles.button} bg-blue-600 text-white rounded p-2`}>
                                    ENVIAR
                                </button>
                            </div>
                            <div className={`${styles.centerText} text-center`}>
                                <label className="label">Volver a </label>
                                <Link to="/admin/login" className={`${styles.blueText} label-text-alt link link-hover`}>
                                    Iniciar Sesion
                                </Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ResetPassword;
