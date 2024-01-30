import { useState } from 'react';
import { Link } from 'react-router-dom';
import Logo from '../../assets/ce-epcc.png';

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import styles from './styles/HomeRegister.module.css';

import axios from 'axios';  // Importa Axios
import { useNavigate } from 'react-router-dom';

function RegistroForm() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        firstname: '',
        lastname: '',
        CUI: '',
        email: '',
        telephone: '',
        password: '',
        confimarPassword: '',
    });


    const limpiarRegistro = () => {
        setFormData({
            firstname: '',
            lastname: '',
            CUI: '',
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

        const { firstname, lastname, CUI, email, telephone, password, confimarPassword } = formData;

        const validationErrors = [];

        if (!firstname) {
            validationErrors.push('Nombres');
        }

        if (!lastname) {
            validationErrors.push('Apellidos');
        }

        if (!CUI || CUI.toString().length !== 8) {
            validationErrors.push('CUI (debe tener exactamente 8 dígitos)');
        }

        if (!email || !/^[^\s@]+@unsa\.edu\.pe$/.test(email)) {
            validationErrors.push('Correo Electrónico (debe tener el formato correcto {ej. cualquiera@unsa.edu.pe})');
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
            // Realizar la solicitud al servidor usando Axios
            const response = await axios.post(`${import.meta.env.VITE_REACT_APP_API_KEY}/api/students/`, formData);

            // Verificar la respuesta del servidor
            if (response.status === 200) {
                // Éxito: Limpiar el formulario y mostrar mensaje de éxito
                toast.success('Cuenta creada exitosamente', {
                    position: toast.POSITION.BOTTOM_RIGHT,
                    autoClose: 2000,
                });

                toast.info('Tu cuenta no ha sido confirmada. Se ha enviado un correo electrónico para la confirmación. Por favor, revisa tu correo electrónico y sigue las instrucciones para confirmar tu cuenta.', {
                    position: toast.POSITION.BOTTOM_RIGHT,
                    autoClose: 5000, // Ajusta el tiempo que deseas mostrar el mensaje
                });
                setTimeout(() => {
                    limpiarRegistro();
                    navigate('/login');
                    // Redirige a la página deseada después del registro
                    //navigate('/client/home'); // Ajusta la ruta según tus necesidades
                }, 1000);
                
            } else {
                // Manejar otros casos de respuesta del servidor según sea necesario
                console.error('Error en la solicitud al servidor:', response);
            }
        } catch (error) {
            console.error('Error en la solicitud al servidor:', error);
        }
    };




    return (
        <div>
            <div className={`${styles.hero} ${styles.heroContent} hero`}>
                <div className="hero-content flex-col lg:flex-row-reverse">
                    <div className={`${styles.card} card flex-shrink-0 w-full max-w-screen-xl h-full shadow-2xl bg-base-100`}>
                        <div className="max-w-screen-xl mx-auto">
                            <div className="text-center lg:text-center">
                                <a className="mx-auto flex items-center justify-center">
                                    <img src={Logo} alt="Logo" className={`${styles.logo} logo`} />
                                </a>
                                <h1 className="text-3xl font-bold">CREAR CUENTA</h1>
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
                                    <label className="block">CUI</label>
                                    <input
                                        type="number"
                                        name="CUI"
                                        value={formData.CUI}
                                        onChange={handleChange}
                                        className="w-full p-2 border border-gray-300 rounded"
                                        placeholder='ej. 20001011'
                                    />
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
                                <div className="col-span-2 text-center">
                                    <button type="submit" className="bg-blue-600 text-white rounded p-2">
                                        Crear Cuenta
                                    </button>
                                </div>
                                <div className={`${styles.centerText} text-center`}>
                                    <label className="label">Ya tienes una cuenta? </label>
                                    <Link to="/login" className={`${styles.blueText} label-text-alt link link-hover`}>
                                        Iniciar Sesion
                                    </Link>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default RegistroForm;
