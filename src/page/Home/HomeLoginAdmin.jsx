import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import Logo from '../../assets/ce-epcc.png';
import styles from './styles/HomeLoginAdmin.module.css';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAdmin } from '../../context/AdminContext';
function HomeLoginAdmin(props) {
    const { setAdminId } = useAdmin();  // Modificado para extraer setAdminId del contexto
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
            // Send login request to server
            const response = await fetch('http://localhost:4000/api/admin/loginAdmin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                const data = await response.json();
                const { token } = data;

                localStorage.setItem('adminToken', token);
                console.log(data);
                const adminId = data.admin._id;
                console.log('ID del admin:', adminId);

                console.log(token);
                toast.success('¡Inicio de sesión exitoso como Aministrador!', {
                    position: toast.POSITION.TOP_CENTER,
                    autoClose: 1000,
                });
                limpiarFormulario();
                localStorage.setItem('logoutEventAdmin', Date.now().toString());
                localStorage.setItem('adminID', adminId);
                setAdminId(adminId);
                console.log(adminId);
                navigate('/admin/home');
            } else {
                toast.error('Credenciales incorrectas', {
                    position: toast.POSITION.BOTTOM_RIGHT,
                    autoClose: 1000,
                });
            }
        } catch (error) {
            console.error('Error during login:', error);
            toast.error('Error interno del servidor', {
                position: toast.POSITION.BOTTOM_RIGHT,
                autoClose: 1000,
            });
        }

    };

    return (
        <form onSubmit={handleSubmit}>
            <div className={`${styles.hero} ${styles.heroContent} ${styles.blackBackground} hero`}>
                <div className="hero-content flex-col lg:flex-row-reverse">
                    <div className={`${styles.card} card flex-shrink-0 w-full max-w-screen-xl h-full shadow-2xl bg-base-100`}>
                        <div className="text-center lg:text-center">
                            <a className="mx-auto flex items-center justify-center">
                                <img src={Logo} alt="Logo" className={`${styles.logo} logo`} />
                            </a>
                            <h1 className="text-2xl font-bold">INICIO DE SESIÓN COMO ADMINISTRADOR</h1>
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
                                    placeholder="email"
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
                                <Link to="/admin/reiniciar-admin" className={`${styles.blueText} label-text-alt link link-hover`}>
                                    ¿Olvidaste tu contraseña?
                                </Link>
                            </div>
                            <div className="col-span-2 text-center">
                                <button type="submit" className={`${styles.button} bg-blue-600 text-white rounded p-2`}>
                                    Iniciar Sesión
                                </button>
                            </div>
                            {/*                             <div className={`${styles.centerText} text-center`}>
                                <label className="label">¿No tienes una cuenta? </label>
                                <Link to="/registrar" className={`${styles.blueText} label-text-alt link link-hover`}>
                                    Registrarse
                                </Link>
                            </div> */}
                        </div>
                    </div>
                </div>
            </div>
        </form>
    );
}

export default HomeLoginAdmin;
