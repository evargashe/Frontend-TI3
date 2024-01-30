import React, { useState, useEffect } from 'react';
import Logo from '../../assets/ce-epcc.png';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styles from './styles/HomeCambiarContraseñaAdmin.module.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function ResetPasswordPage() {
    const navigate = useNavigate()
    const { token } = useParams();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    // Obtener la URL actual
    const url = window.location.href;
    // Extraer el parámetro "email" de la URL
    const emailParam = new URLSearchParams(new URL(url).search).get('email');

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validar que todos los campos estén llenos
        if (!password || !confirmPassword) {
            toast.error('Por favor, completa todos los campos.', {
                position: toast.POSITION.BOTTOM_RIGHT,
                autoClose: 2000,
            });
            return;
        }

        // Validar que ambas contraseñas tengan más de 6 caracteres
        if (password.length < 6 || confirmPassword.length < 6) {
            toast.error('Ambas contraseñas deben tener al menos 6 caracteres.', {
                position: toast.POSITION.BOTTOM_RIGHT,
                autoClose: 2000,
            });
            return;
        }

        // Validar que ambas contraseñas coincidan
        if (password !== confirmPassword) {
            toast.error('Las contraseñas no coinciden.', {
                position: toast.POSITION.BOTTOM_RIGHT,
                autoClose: 2000,
            });
            return;
        }
        // Enviar solicitud al backend para cambiar la contraseña
        try {
            const response = await axios.post('http://localhost:4000/api/admin/update-password', {
                email: emailParam, // Reemplaza con el email correspondiente
                newPassword: password, // Estoy asumiendo que deseas cambiar la contraseña a la que ingresaste en el formulario
                token: token
            });

            if (response.status === 200) {
                // Contraseña modificada satisfactoriamente
                toast.success('Contraseña modificada correctamente. Ya puedes iniciar sesión como Administrador', {
                    position: toast.POSITION.BOTTOM_RIGHT,
                    autoClose: 2000,
                });

                // Limpiar el formulario después de 2000 milisegundos (3 segundos)
                setTimeout(() => {
                    setPassword('');
                    navigate('/admin/login');
                }, 2000);
            } else {
                // Manejar el caso en que el token es inválido o ya ha sido utilizado
                toast.error(`Error al modificar la contraseña. ${response.data.msg}`, {
                    position: toast.POSITION.BOTTOM_RIGHT,
                    autoClose: 2000,
                });
            }
        } catch (error) {
            toast.error(error.response.data.msg || 'Error al modificar la contraseña. Por favor, solicite un nuevo token para el cambio de contraseña.', {
                position: toast.POSITION.BOTTOM_RIGHT,
                autoClose: 2000,
            });
            setTimeout(() => {
                navigate('/admin/reiniciar-admin');
            }, 2000);
        }
    };


    return (
        <div className={`${styles.hero} ${styles.blackBackground} hero min-h-screen bg-base-200`}>
            <div className="hero-content flex-col lg:flex-row-reverse">
                <div className={`${styles.card} card flex-shrink-0 w-full max-w-screen-xl h-full shadow-2xl bg-base-100`}>
                    <div className="max-w-screen-xl mx-auto">
                        <div className="text-center lg:text-center">
                            <a className="mx-auto flex items-center justify-center">
                                <img src={Logo} alt="Logo" className={`${styles.logo} logo`} />
                            </a>
                            <h1 className="text-2xl font-bold">REINICIAR CONTRASEÑA</h1>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="form-control">
                                <label className="label">
                                    <span className="block">Nueva Contraseña</span>
                                </label>
                                <div>
                                    <input
                                        className="w-full p-3 border border-gray-300 rounded-lg"
                                        type="password"
                                        name="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder='Digite más de 6 caracteres'
                                    />
                                </div>
                            </div>
                            <div className="form-control">
                                <label className="label">
                                    <span className="block">Confirmar Contraseña</span>
                                </label>
                                <div>
                                    <input
                                        className="w-full p-3 border border-gray-300 rounded-lg"
                                        type="password"
                                        name="confirmPassword"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        placeholder='Digite más de 6 caracteres'
                                    />
                                </div>
                            </div>
                            <div className="text-center mt-4">
                                <button type="submit" className={`${styles.button} bg-blue-600 text-white rounded p-2`}>
                                    Cambiar Contraseña
                                </button>
                            </div>

                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ResetPasswordPage;
