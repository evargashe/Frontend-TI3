import React, { useState, useEffect } from 'react';
import ReactPaginate from 'react-paginate';
import styles from './styles/HomeEquiposSolicitados.module.css';
import './styles/HomePaginationStyles.css';
import axios from 'axios';
import ModalDetallesEquipo from '../../component/Admin/EquiposSolicitados/ModalDetallesEquipo';
import { calculateTimeRemaining } from '../../component/Admin/EquiposSolicitados/calculateTimeRamaining';

const TableEquiposSolicitados = () => {
    // Datos de ejemplo (puedes reemplazarlos con tus propios datos)
    const [reservas, setReservas] = useState([]);
    const [remainingTimes, setRemainingTimes] = useState({});
    const [fetchData, setFetchData] = useState(false);  
    const [currentPage, setCurrentPage] = useState(0); // Estado para rastrear la página actual
    const itemsPerPage = 10; // Número de elementos por página

    // OBTENER TODAS LAS RESERVACIONES DEL LIBRO
    useEffect(() => {
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
                    const studentResponse = await axios.get(`${import.meta.env.VITE_REACT_APP_API_KEY}/api/admin/getStudent/${item.userId}`);
                    const studentName = studentResponse.data.firstname + ' ' + studentResponse.data.lastname;
                    return { ...item, studentName };
                }));
                setReservas(reservasWithNames);
            } catch (error) {
                console.error('Error al obtener los libros:', error);
            }
        };
        fetchData();
    }, [fetchData]);

    useEffect(() => {
        const intervalId = setInterval(async () => {
            // Actualizar la fecha actual cada segundo
            const now = new Date();

            // Actualizar el tiempo restante cada segundo
            const updatedTimes = {};
            const updatedReservas = await Promise.all(reservas.map(async (item) => {
                if (item.state === 'RECHAZADO' && item.deleteScheduled) {
                    updatedTimes[item._id] = calculateTimeRemaining(item.deleteScheduled);
                    // Comparar la fecha actual con scheduledTime
                    const scheduledTime = new Date(item.deleteScheduled);
                    if (now > scheduledTime) {
                        // Ha pasado una hora, eliminar la reserva
                        await axios.delete(`${import.meta.env.VITE_REACT_APP_API_KEY}/api/admin/deleteReservationById/${item.type}/${item._id}`);
                        //window.location.reload();
                    }
                }
                return item;
            }));
            setRemainingTimes(updatedTimes);
            setReservas(updatedReservas);
            reloadData();
        }, 1000);

        return () => clearInterval(intervalId); // Limpieza del intervalo al desmontar el componente
    }, [reservas]);

    const reloadData = () => {
        setFetchData(prevState => !prevState);
    };

    useEffect(() => {
        const intervalId = setInterval(() => {
            // Actualizar el tiempo restante cada segundo
            const updatedTimes = {};
            reservas.forEach(item => {
                if (item.state === 'RECHAZADO' && item.deleteScheduled) {
                    updatedTimes[item._id] = calculateTimeRemaining(item.deleteScheduled);
                }
            });
            setRemainingTimes(updatedTimes);
            setReservas(reservas);
        }, 1000);

        return () => clearInterval(intervalId); // Limpieza del intervalo al desmontar el componente
    }, [reservas]);

    const handlePageClick = ({ selected }) => {
        setCurrentPage(selected);
    };
    const filteredData = reservas.filter(item => item.state !== 'ACEPTADO');
    const offset = currentPage * itemsPerPage;
    const currentData = filteredData.slice(offset, offset + itemsPerPage);
    const pageCount = Math.ceil(filteredData.length / itemsPerPage); // Cálculo del número total de páginas
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [selectedItemDetails, setSelectedItemDetails] = useState(null);
    const [typeItem, setTypeItem] = useState(null);
    const [idReserva, setIdReserva] = useState(null);
    const [stateReservation, setStateReservation] = useState(null);
    // Mostrar mas detalles del Equipo
    const [selectedItem, setSelectedItem] = useState(null);
    const [getItemId, setGetItemId] =useState(null);

    const handleVerDetallesClick = async (type, itemId, reservationId, estadoReserva, idBookEquipment) => {
        try {
            // Corrige el tipo de categoría aquí
            const correctedType = type === 'book' ? 'books' : 'equipments';
            const response = await axios.get(`${import.meta.env.VITE_REACT_APP_API_KEY}/api/admin/getDetails/${correctedType}/${itemId}`);
            setSelectedItem(response.data);
            setShowDetailsModal(true);
            setSelectedItemDetails(itemId); // actualzar el id del equipo o libro
            setIdReserva(reservationId); // Actualizar el id de la reserva 
            setTypeItem(type); //actualizar el type del equipo o libro
            setStateReservation(estadoReserva); //actualizar el estado de la reserva
            setGetItemId(idBookEquipment); //actualizar el estado del id del equipo o libro
            console.log(selectedItem);
            // Abre tu modal aquí
        } catch (error) {
            console.error('Error al obtener detalles:', error);
        }
    }
    return (
        <div className="max-w-screen-xl mx-auto mt-2 p-2 bg-white rounded-lg shadow-lg">
            {showDetailsModal && selectedItemDetails && typeItem && idReserva && getItemId && (
                <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-800 bg-opacity-75">
                    <ModalDetallesEquipo details={selectedItemDetails} type={typeItem} idReservation={idReserva} stateReservation={stateReservation} id={getItemId} onClose={() => setShowDetailsModal(false)} />
                </div>
            )}
            <div className='text-center lg:text-center'>
                <p className='text-3xl font-bold mb-4'>Equipos/Libros Solicitados del día</p>
            </div>
            <div className="overflow-x-auto">
                {/* Paginación */}
                <div className="mt-4 flex justify-center">
                    <ReactPaginate
                        previousLabel={<span className="px-2 py-1 rounded border border-gray-300 bg-white">Anterior</span>}
                        nextLabel={<span className="px-2 py-1 rounded border border-gray-300 bg-white">Siguiente</span>}
                        breakLabel={<span className="px-2 py-1 rounded border border-gray-300 bg-white">...</span>}
                        pageCount={pageCount}
                        marginPagesDisplayed={2}
                        pageRangeDisplayed={5}
                        onPageChange={handlePageClick}
                        containerClassName={'pagination flex justify-center'}
                        subContainerClassName={'pages flex'}
                        activeClassName={'active'}
                        pageClassName={'px-2 py-1 rounded border border-gray-300 bg-white'}
                        pageLinkClassName={'text-gray-800'}
                    />
                </div>
                <table className="w-full table-auto">
                    {/* Encabezado de la tabla */}
                    <thead>
                        <tr>
                            <th className="sm:px-2 py-3 bg-gray-800 text-white text-center sm:min-w-20 md:min-w-30">Categoria</th>
                            <th className="sm:px-2 py-3 bg-gray-800 text-white text-center sm:min-w-20 md:min-w-30">Nombre del Solicitante</th>
                            <th className="sm:px-2 py-3 bg-gray-800 text-white text-center sm:min-w-20 md:min-w-30">Fecha Solicitada</th>
                            <th className="sm:px-2 py-3 bg-gray-800 text-white text-center sm:min-w-20 md:min-w-30">Hora Solicitada</th>
                            <th className="sm:px-2 py-3 bg-gray-800 text-white text-center sm:min-w-20 md:min-w-30">Código</th>
                            <th className="sm:px-2 py-3 bg-gray-800 text-white text-center sm:min-w-20 md:min-w-30">Estado</th>
                            <th className="sm:px-2 py-3 bg-gray-800 text-white text-center sm:min-w-20 md:min-w-30"></th>
                        </tr>
                    </thead>
                    {/* Cuerpo de la tabla */}
                    <tbody>
                        {currentData.length === 0 ? (
                            <tr>
                                <td colSpan="7" className="text-center py-4 text-gray-500">No existen reservas por el momento.</td>
                            </tr>
                        ) : (
                            currentData.map((item, index) => (
                                // Agregar la condición para ocultar las filas con estado 'ACEPTADO'
                                item.state !== 'ACEPTADO' && (
                                    <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-200'}>
                                        <td className="px-6 py-4 whitespace-nowrap bg-gray-300">
                                            {item.type === 'book' ? (<p>Libro</p>) : (<p>Equipo</p>)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">{item.studentName}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {new Date(item.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {new Date(item.createdAt).toLocaleTimeString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">{item.verificationCode}</td>
                                        <td className={`text text-center px-6 py-4 whitespace-nowrap ${styles[item.state === 'PENDIENTE' ? 'bg-pendiente' : (item.state === 'RECHAZADO' ? 'bg-rechazado' : 'bg-aceptado')]}`}>
                                            {item.state}
                                            {item.state === 'RECHAZADO' && item.deleteScheduled && (
                                                <div className="mt-2">
                                                    Tiempo restante: {remainingTimes[item._id]}
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {item.type === 'book' ? (
                                                <button onClick={() => handleVerDetallesClick(item.type, item.bookId, item._id, item.state, item.bookId)} className="px-5 py-1 rounded bg-green-500 text-white hover:bg-blue-700">
                                                    Ver más detalles
                                                </button>) : (
                                                <button onClick={() => handleVerDetallesClick(item.type, item.equipmentId, item._id, item.state, item.equipmentId)} className="px-5 py-1 rounded bg-green-500 text-white hover:bg-blue-700">
                                                    Ver más detalles
                                                </button>)}
                                        </td>
                                    </tr>
                                )
                            )))}
                    </tbody>
                </table>
            </div>

        </div>
    );
};

export default TableEquiposSolicitados;
