import React, { useState, useEffect } from 'react'
import ReactPaginate from 'react-paginate';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import axios from 'axios';
import Modal from 'react-modal';
import HistorialUsuarioTable from '../../component/Cliente/HomePerfil/HistorialUsuarioTable';
import { toast } from 'react-toastify';
import userFoto from '../../assets/userData.png'

function Perfil() {
    const { userId } = useUser();
    const navigate = useNavigate();
    const [userHistory, setUserHistory] = useState([]);
    const [userData, setUserData] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [originalUserData, setOriginalUserData] = useState({}); // Nuevo estado para almacenar los datos originales
    const [showHistorial, setShowHistorial] = useState(true); // Nuevo estado para controlar qué vista mostrar

    useEffect(() => {
        const fetchUserHistory = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_REACT_APP_API_KEY}/api/students/user-history-by-id/${userId}`);
                const responseUser = await axios.get(`${import.meta.env.VITE_REACT_APP_API_KEY}/api/students/getStudentById/${userId}`);

                const receivedData = response.data;

                // Asegúrate de que receivedData sea un array o conviértelo en uno si es un objeto
                const historyArray = Array.isArray(receivedData) ? receivedData : [receivedData];
                setUserData(responseUser.data);
                setUserHistory(historyArray);
            } catch (error) {
                console.error('Error al obtener historial del usuario', error);
            }
        };
        if (userId === null) {
            // Puedes redirigir o mostrar un mensaje aquí
            navigate('/login');
        } else {
            fetchUserHistory();
        }
    }, [userId, navigate]);



    const [itemDetails, setItemDetails] = useState({});

    useEffect(() => {
        const fetchItemDetails = async (itemId, itemType) => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_REACT_APP_API_KEY}/api/students/get-item-by-id/${itemType}/${itemId}`);
                setItemDetails((prevDetails) => ({
                    ...prevDetails,
                    [itemId]: response.data,
                }));
            } catch (error) {
                console.error(`Error al obtener detalles del ${itemType} con ID ${itemId}`, error);
            }
        };

        // Llamada a la función fetchItemDetails para cada item en userHistory
        userHistory.forEach((item) => {
            fetchItemDetails(item.itemId, item.itemType);
        });
    }, [userHistory]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserData({ ...userData, [name]: value });
    };


    const isPhoneNumberValid = (phoneNumber) => {
        // Verificar que el número de teléfono tiene 9 dígitos
        return /^\d{9}$/.test(phoneNumber);
    };

    const isCuiValid = (cui) => {
        // Verificar que el CUI tiene 8 dígitos
        return /^\d{8}$/.test(cui);
    };

    const handleUpdate = async (e) => {
        e.preventDefault(); // Evitar que el formulario se envíe automáticamente

        if (!isPhoneNumberValid(userData.telephone)) {
            toast.error('El número de teléfono debe tener 9 dígitos.', {
                position: toast.POSITION.BOTTOM_RIGHT,
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            return;
        }

        if (!isCuiValid(userData.CUI)) {
            toast.error('El CUI debe tener 8 dígitos.', {
                position: toast.POSITION.BOTTOM_RIGHT,
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            return;
        }
        try {
            const response = await axios.put(`${import.meta.env.VITE_REACT_APP_API_KEY}/api/students/update-student-by-id/${userId}`, userData);
            toast.success('Datos actualizados correctamente', {
                position: toast.POSITION.BOTTOM_RIGHT,
                autoClose: 1000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            setIsEditing(false); // Cambiar el estado de edición después de la actualización
            // Puedes realizar acciones adicionales después de la actualización si es necesario
        } catch (error) {
            console.error('Error al actualizar estudiante:', error);
        }
    };

    const handleEdit = () => {
        setIsEditing(true); // Cambiar al modo de edición al hacer clic en "Editar" 
        setOriginalUserData({ [fieldBeingEdited]: userData[fieldBeingEdited] });
    };

    const handleCancel = () => {
        setIsEditing(false); // Cancelar la edición y volver al modo de visualización
        setUserData({ ...userData, [fieldBeingEdited]: originalUserData[fieldBeingEdited] });
    };

    const toggleView = () => {
        setShowHistorial((prevShowHistorial) => !prevShowHistorial); // Cambia el estado para alternar entre historial y detalles de cuenta
    };

    const [reservas, setReservas] = useState([]);
    const fetchData = async () => {
        try {
            const responseBook = await axios.get(`${import.meta.env.VITE_REACT_APP_API_KEY}/api/admin/getReservation/books`);
            const responseEquipment = await axios.get(`${import.meta.env.VITE_REACT_APP_API_KEY}/api/admin/getReservation/equipments`);
            const combinedReservas = [...responseBook.data, ...responseEquipment.data];
            // Ordenar por la propiedad 'createdAt' 
            combinedReservas.sort((a, b) => {
                const dateA = new Date(a.createdAt);
                const dateB = new Date(b.createdAt);

                // Compara las fechas
                if (dateA < dateB) return -1;
                if (dateA > dateB) return 1;

                // Si las fechas son iguales, compara las horas
                const timeA = dateA.getTime();
                const timeB = dateB.getTime();

                return timeA - timeB;
            });
            const reservasWithNames = await Promise.all(combinedReservas.map(async (item) => {
                const correctedType = item.type === 'book' ? 'books' : 'equipments';
                const categoryResponse = await axios.get(`${import.meta.env.VITE_REACT_APP_API_KEY}/api/admin/get/${correctedType}/${item.type === 'book' ? item.bookId : item.equipmentId}`);
                const categoryName = item.type === 'book' ? categoryResponse.data.title : categoryResponse.data.name;
                return { ...item, categoryName };
            }));
            setReservas(reservasWithNames);
        } catch (error) {
            console.error('Error al obtener los libros:', error);
        }
    };


    useEffect(() => {
        fetchData();
    }, [fetchData]);
    // Filtrar los datos para mostrar solo los equipos ACEPTADOS
    const filteredData = reservas.filter(item => item.userId === userId);
    const [currentPage, setCurrentPage] = useState(0); // Estado para rastrear la página actual
    const itemsPerPage = 5; // Número de elementos por página
    const pageCount = Math.ceil(filteredData.length / itemsPerPage); // Cálculo del número total de páginas

    const handlePageClick = ({ selected }) => {
        setCurrentPage(selected);
    };

    const offset = currentPage * itemsPerPage;
    const currentData = filteredData.slice(offset, offset + itemsPerPage);
    return (
        <div>
            <div className="max-w-screen-xl mx-auto mt-2 p-2 bg-white rounded-lg shadow-lg">
                <div className='flex justify-between'>
                    <div className='justify-end'>
                        <button onClick={toggleView} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full mt-4">
                            {showHistorial ? 'Mostrar Historial' : 'Mostrar Detalles de Cuenta'}
                        </button>
                    </div>
                </div>

                {
                    showHistorial ? (
                        <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-md shadow-md">
                            <img src={userFoto} alt="Foto de perfil" className="w-32 h-32 mx-auto mb-2 rounded-full" />

                            <form onSubmit={handleUpdate}>

                                <div className='text text-center'>
                                    <label htmlFor="firstname" className="text-xl font-semibold">Nombre:</label>
                                    <input
                                        type="text"
                                        id="firstname"
                                        name="firstname"
                                        value={userData.firstname}
                                        onChange={handleChange}
                                        className="block w-full border-b-2 border-gray-300 mb-4 focus:outline-none focus:border-blue-500 text text-center"
                                        disabled={!isEditing}
                                    />

                                    <label htmlFor="lastname" className="text-xl font-semibold">Apellido:</label>
                                    <input
                                        type="text"
                                        id="lastname"
                                        name="lastname"
                                        value={userData.lastname}
                                        onChange={handleChange}
                                        className="block w-full border-b-2 border-gray-300 mb-4 focus:outline-none focus:border-blue-500 text text-center"
                                        disabled={!isEditing}
                                    />

                                    <label htmlFor="telephone" className="text-gray-600">Teléfono:</label>
                                    <input
                                        type="tel"
                                        id="telephone"
                                        name="telephone"
                                        value={userData.telephone}
                                        onChange={handleChange}
                                        className="block w-full border-b-2 border-gray-300 mb-4 focus:outline-none focus:border-blue-500 text text-center"
                                        disabled={!isEditing}
                                    />

                                    <label htmlFor="cui" className="text-gray-600">CUI:</label>
                                    <input
                                        type="number"
                                        id="cui"
                                        name="CUI"
                                        value={userData.CUI}
                                        onChange={handleChange}
                                        className="block w-full border-b-2 border-gray-300 mb-4 focus:outline-none focus:border-blue-500 text text-center"
                                        disabled={!isEditing}
                                    />

                                    <label htmlFor="email" className="text-gray-600">Correo:</label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={userData.email}
                                        onChange={handleChange}
                                        className="block w-full border-b-2 border-gray-300 mb-4 focus:outline-none focus:border-blue-500 text text-center"
                                        disabled
                                    />
                                    {isEditing ? (
                                        <div>
                                            <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full mt-4">
                                                Guardar cambios
                                            </button>
                                            <button type="button" onClick={handleCancel} className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-full mt-4 ml-4">
                                                Cancelar
                                            </button>
                                        </div>
                                    ) : (
                                        // Mostrar el botón "Editar" cuando no esté en modo de edición
                                        <button type="button" onClick={handleEdit} className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded-full mt-4">
                                            Editar
                                        </button>
                                    )}
                                </div>
                            </form>
                        </div>

                    ) : (
                        <div className="max-w-screen-xl mx-auto mt-10 p-6 bg-white rounded-md shadow-md">
                            <div className="w-full">
                                <HistorialUsuarioTable userHistory={userHistory} itemDetails={itemDetails} currentData={currentData} pageCountReserva={pageCount} handlePageClickReserva={handlePageClick} />
                            </div>
                        </div>
                    )
                }
            </div >
        </div>

    );
}

export default Perfil;