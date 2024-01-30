import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import Logo from '../../assets/ce-epcc.png';
import styles from './styles/HomeLogin.module.css';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useUser } from '../../context/UserContext';


function HomeLogin(props) {
    const { setUserId } = useUser();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const navigate = useNavigate();

    const limpiarFormulario = () => {
        setFormData({
            email: '',
            password: '',
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

        if (!formData.email) {
            toast.error('Por favor, ingrese el correo electrónico.', {
                position: toast.POSITION.BOTTOM_RIGHT,
                autoClose: 1000,
            });
            return;
        }

        if (!formData.password) {
            toast.error('Por favor, ingrese la contraseña.', {
                position: toast.POSITION.BOTTOM_RIGHT,
                autoClose: 1000,
            });
            return;
        }
        try {
            const response = await fetch("http://localhost:4000/api/students/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                const data = await response.json();
                // Imprime la respuesta completa en la consola
                //console.log('Respuesta del servidor:', data);

                // Guarda el token en las cookies del cliente

                localStorage.setItem('token', data.token);

                // Accede al objeto de estudiante y obtén el ID

                const studentId = data.student._id;
                //setUserId(studentId);
                console.log('ID del Usuario:', studentId);

                // Aquí puedes continuar con el resto del código después del inicio de sesión exitoso
                // Por ejemplo, puedes realizar más acciones, cargar datos adicionales, etc.
                toast.success('¡Inicio de sesión exitoso!', {
                    position: toast.POSITION.TOP_CENTER,
                    autoClose: 1000,
                });
                // Guarda el token y el userId en localStorage
                localStorage.setItem('token', data.token);
                localStorage.setItem('logoutEvent', Date.now().toString());
                localStorage.setItem('userId', studentId);
                setUserId(studentId);
                navigate('/client/home'); // Ajusta la ruta según tus necesidades
                //limpiar el formulario y redirigir a client/home
                setTimeout(() => {
                    limpiarFormulario();
                    // Redirige a la página deseada después del inicio de sesión
                }, 1000);
            } else {
                const errorData = await response.json();
                toast.error(errorData.msg || "Error durante el inicio de sesión", {
                    position: toast.POSITION.BOTTOM_RIGHT,
                    autoClose: 1000,
                });
            }
        } catch (error) {
            console.error("Error durante el inicio de sesión:", error);
            toast.error(
                "Error durante el inicio de sesión. Por favor, inténtelo de nuevo.",
                {
                    position: toast.POSITION.BOTTOM_RIGHT,
                    autoClose: 1000,
                }
            );
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className={`${styles.hero} ${styles.heroContent} hero`}>
                <div className="hero-content flex-col lg:flex-row-reverse">
                    <div className={`${styles.card} card flex-shrink-0 w-full max-w-screen-xl h-full shadow-2xl bg-base-100`}>
                        <div className="text-center lg:text-center">
                            <a className="mx-auto flex items-center justify-center">
                                <img src={Logo} alt="Logo" className={`${styles.logo} logo`} />
                            </a>
                            <h1 className="text-3xl font-bold">INICIAR SESIÓN</h1>
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
                            <div className={`${styles.formControl} form-control`}>
                                <label className="label">
                                    <span className="label-text">Contraseña</span>
                                </label>
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="password"
                                    className="input input-bordered"
                                />
                            </div>
                            <div className="flex justify-end">
                                <Link to="/reiniciar" className={`${styles.blueText} label-text-alt link link-hover`}>
                                    ¿Olvidaste tu contraseña?
                                </Link>
                            </div>
                            <div className="col-span-2 text-center">
                                <button type="submit" className={`${styles.button} bg-blue-600 text-white rounded p-2`}>
                                    Iniciar Sesión
                                </button>
                            </div>
                            <div className={`${styles.centerText} text-center`}>
                                <label className="label">¿No tienes una cuenta? </label>
                                <Link to="/registrar" className={`${styles.blueText} label-text-alt link link-hover`}>
                                    Registrarse
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    );
}

export default HomeLogin;
