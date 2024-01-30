import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import Logo from '../../assets/ce-epcc.png';

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import styles from './styles/HomeRegistroAdmin.module.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function RegistroAdmin() {
    const navigate = useNavigate();
    const location = useLocation();
    const [formData, setFormData] = useState({
        firstname: '',
        lastname: '',
        email: '',
        telephone: '',
        password: '',
        confimarPassword: '',
    });

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const emailFromLink = searchParams.get('email');

        if (emailFromLink) {
            setFormData((prevData) => ({
                ...prevData,
                email: decodeURIComponent(emailFromLink),
            }));
        }

        const checkAdminData = async () => {
            try {
                // Verificar si el correo ya está registrado
                const response = await axios.get(`${import.meta.env.VITE_REACT_APP_API_KEY}/api/admin/getAdminData/${formData.email}`);
                const adminData = response.data;
                // Si el correo ya está registrado, redirigir a la página de inicio de sesión con un mensaje
                toast.info('Ya estás registrado como administrador. Por favor, inicia sesión.');
                navigate('/admin/login');
            } catch (error) {
                // Si el correo no está registrado, continuar mostrando el formulario
            }
        };

        // Verificar si el correo ya está registrado al cargar el componente
        checkAdminData();
    }, [formData.email, location.search, navigate]);

    const limpiarRegistro = () => {
        setFormData({
            firstname: '',
            lastname: '',
            email: '',
            telephone: '',
            password: '',
            confimarPassword: '',
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
        console.log(formData);
        const { firstname, lastname, email, telephone, password, confimarPassword } = formData;

        const validationErrors = [];

        if (!firstname) {
            validationErrors.push('Nombres');
        }

        if (!lastname) {
            validationErrors.push('Apellidos');
        }

        if (!telephone || telephone.toString().length !== 9) {
            validationErrors.push('Teléfono (debe tener exactamente 9 dígitos)');
        }

        if (!password || password.length < 6) {
            validationErrors.push('Contraseña (debe tener al menos 6 caracteres)');
        }

        if (password !== confimarPassword) {
            validationErrors.push('Confirmar Contraseña (debe coincidir con la contraseña)');
        }

        if (validationErrors.length > 0) {
            validationErrors.forEach((error) => {
                toast.error(`Falta llenar el campo: ${error}`, {
                    position: toast.POSITION.BOTTOM_RIGHT,
                    autoClose: 3000,
                });
            });
            return;
        }
        try {
            const response = await axios.post(`${import.meta.env.VITE_REACT_APP_API_KEY}/api/admin/registrar-admin`, { firstname, lastname, email, telephone, password });

            console.log(response.data);
            toast.success('Administrador registrado correctamente. Ya puedes iniciar sesion como administrador', {
                position: toast.POSITION.BOTTOM_RIGHT,
                autoClose: 2000,
            });
            setTimeout(() => {
                navigate('/admin/login');
                limpiarRegistro();
            }, 2000);
        } catch (error) {
            toast.error(`Este correo ya esta registrado`, {
                position: toast.POSITION.BOTTOM_RIGHT,
                autoClose: 2000,
            });
        }

    };

    return (
        <div>
            <div className={`${styles.hero} ${styles.heroContent} hero`}>
                <div className="hero-content flex-col lg:flex-row-reverse">
                    <div className={`${styles.card} card flex-shrink-0 w-full max-w-screen-xl h-full shadow-2xl bg-base-100`}>
                        <div className="max-w-screen-xl mx-auto mb-4">
                            <div className="text-center lg:text-center">
                                <a className="mx-auto flex items-center justify-center">
                                    <img src={Logo} alt="Logo" className={`${styles.logo} logo`} />
                                </a>
                                <h1 className="text-3xl font-bold">REGISTRAR CUENTA</h1>
                            </div>

                            <form onSubmit={handleSubmit}>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block">Nombres</label>
                                        <input
                                            type="text"
                                            name="firstname"
                                            value={formData.firstname}
                                            onChange={handleChange}
                                            className="w-full p-2 border border-gray-300 rounded"
                                        />
                                    </div>
                                    <div>
                                        <label className="block">Apellidos</label>
                                        <input
                                            type="text"
                                            name="lastname"
                                            value={formData.lastname}
                                            onChange={handleChange}
                                            className="w-full p-2 border border-gray-300 rounded"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block">Correo Electronico</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full p-2 border border-gray-300 rounded"
                                        placeholder='ej. usuario@unsa.edu.pe'
                                        disabled
                                    />
                                </div>
                                <div>
                                    <label className="block">Teléfono</label>
                                    <input
                                        type="number"
                                        name="telephone"
                                        value={formData.telephone}
                                        onChange={handleChange}
                                        className="w-full p-2 border border-gray-300 rounded"
                                        placeholder='ej. 999888777'
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block">Contraseña</label>
                                        <input
                                            type="password"
                                            name="password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            className="w-full p-2 border border-gray-300 rounded"
                                            placeholder='Digite más de 6 caracteres'
                                        />
                                    </div>
                                    <div>
                                        <label className="block">Confirmar Contraseña</label>
                                        <input
                                            type="password"
                                            name="confimarPassword"
                                            value={formData.confimarPassword}
                                            onChange={handleChange}
                                            className="w-full p-2 border border-gray-300 rounded"
                                            placeholder='Digite más de 6 caracteres'
                                        />
                                    </div>
                                </div>
                                <div className="col-span-2 text-center mb-4">
                                    <button type="submit" className={`${styles.button} bg-blue-600 text-white rounded p-2`}>
                                        Registrarse
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default RegistroAdmin;
