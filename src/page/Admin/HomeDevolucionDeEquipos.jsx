import React, { useState, useEffect } from 'react';
import ReactPaginate from 'react-paginate';
import { CheckmarkSharp } from 'react-ionicons'; //import { CloseSharp } from 'react-ionicons';
import './styles/HomePaginationStyles.css';
import formattedDate from '../../component/Admin/DevolucionDeEquipos/FormattedDate';
import parseCustomTime from '../../component/Admin/DevolucionDeEquipos/parseCustomTime';
import getEstadoDevolucion from '../../component/Admin/DevolucionDeEquipos/getEstadoDevolucion';
import Modal from '../../component/Admin/DevolucionDeEquipos/Modal';
import ModalEditar from '../../component/Admin/DevolucionDeEquipos/ModalEditarDevolucion';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';
import axios from 'axios';

const TableDevolucionDeEquipos = () => {
    const [reservas, setReservas] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [autoUpdate, setAutoUpdate] = useState(true);

    const [shouldUpdateTable, setShouldUpdateTable] = useState(false);

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
                const correctedType = item.type === 'book' ? 'books' : 'equipments';
                const categoryResponse = await axios.get(`${import.meta.env.VITE_REACT_APP_API_KEY}/api/admin/get/${correctedType}/${item.type === 'book' ? item.bookId : item.equipmentId}`);
                const categoryName = item.type === 'book' ? categoryResponse.data.title : categoryResponse.data.name;
                return { ...item, studentName, categoryName};
            }));
            setReservas(reservasWithNames);
        } catch (error) {
            console.error('Error al obtener los libros:', error);
        }
    };

    useEffect(() => {
        fetchData();
        // Actualizar cada segundo si autoUpdate es verdadero
        const intervalId = autoUpdate && setInterval(fetchData, 1000);

        // Limpiar el intervalo al desmontar el componente
        return () => clearInterval(intervalId);
    }, [fetchData, autoUpdate]);

    const handleUpdateStateIfAmountIsZero = async (type, id) => {
        try {
            const response = await axios.put(`${import.meta.env.VITE_REACT_APP_API_KEY}/api/admin/update-state-to-available-if-zero/${type}/${id}`);
        } catch (error) {
            console.error('Error al actualizar el estado:', error.response?.data?.error || 'Error desconocido');
        }
    };

    const handleCheckmarkClick = async (reservationId, type, itemId) => {
        try {

            const typeItem = type == 'book' ? 'Libro' : 'Equipo';
            const confirmAction = await Swal.fire({
                title: `¿Estás seguro que deseas devolver el ${typeItem}?`,
                icon: 'warning', // Cambiar el icono a 'warning'
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Aceptar',
                cancelButtonText: 'Cancelar',
            });

            if (confirmAction.isConfirmed) {
                // Realizar la solicitud PUT al nuevo endpoint para actualizar currentTime
                await handleUpdateStateIfAmountIsZero(type, itemId);
                await axios.put(`${import.meta.env.VITE_REACT_APP_API_KEY}/api/admin/updateCurrentTime/${type}/${reservationId}/${itemId}`);
                toast.success(`Se devolvio correctamente el ${typeItem}`, {
                    position: toast.POSITION.BOTTOM_RIGHT,
                    autoClose: 1000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
                // Refrescar la lista de reservas
                fetchData();
                setShouldUpdateTable(true);
            }
        } catch (error) {
            console.error('Error al actualizar currentTime:', error);
        }
    };


    useEffect(() => {
        if (shouldUpdateTable) {
            fetchData();
            setShouldUpdateTable(false);
        }
    
        // Resto del código del useEffect
    }, [shouldUpdateTable, fetchData, autoUpdate]);
    
    const handleEditDevolucionClick = (reservationId, type) => {
        const selected = reservas.find(item => item._id === reservationId);
        setSelectedItem(selected);
        
        // Abre el modal
        setIsModalOpen(true);
    }

    const closeModal = () => {
        // Cierra el modal y limpia el estado del item seleccionado
        setIsModalOpen(false);
        setSelectedItem(null);
    };


    // Filtrar los datos para mostrar solo los equipos ACEPTADOS
    const filteredData = reservas.filter(item => item.state === 'ACEPTADO');
    const [currentPage, setCurrentPage] = useState(0); // Estado para rastrear la página actual
    const itemsPerPage = 10; // Número de elementos por página
    const pageCount = Math.ceil(filteredData.length / itemsPerPage); // Cálculo del número total de páginas

    const handlePageClick = ({ selected }) => {
        setCurrentPage(selected);
    };

    const offset = currentPage * itemsPerPage;
    const currentData = filteredData.slice(offset, offset + itemsPerPage);
    return (
        <div className="max-w-screen-xl mx-auto mt-2 p-2 bg-white rounded-lg shadow-lg">
            {/* Modal */}
            <Modal isOpen={isModalOpen} onClose={closeModal}>
                {/* Renderiza el contenido del modal basado en el tipo de item */}
                {selectedItem && (
                    <ModalEditar item={selectedItem} />
                )}
            </Modal>


            <div className="text-center">
                <p className="text-3xl font-bold mb-4">Devolucion de Equipos</p>
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
                            {/*Equipo/Libro  , Estudiante , Fecha en la que deberia ser devuelta , Codigo , Devuelto y tambien edaitar donde se va cambiar la fecha de entrega*/}
                            <th className="sm:px-2 py-3 bg-gray-800 text-white text-center sm:min-w-20 md:min-w-30">Categoria</th>
                            <th className="sm:px-2 py-3 bg-gray-800 text-white text-center sm:min-w-20 md:min-w-30">Nombre del Estudiante</th>
                            <th className="sm:px-2 py-3 bg-gray-800 text-white text-center sm:min-w-20 md:min-w-30">Nombre de la categoria</th>
                            <th className="sm:px-2 py-3 bg-gray-800 text-white text-center sm:min-w-20 md:min-w-30">Fecha de entrega</th>
                            <th className="sm:px-2 py-3 bg-gray-800 text-white text-center sm:min-w-20 md:min-w-30">Codigo</th>
                            <th className="sm:px-2 py-3 bg-gray-800 text-white text-center sm:min-w-20 md:min-w-30">Estado de Devolucion</th>
                            <th className="sm:px-2 py-3 bg-gray-800 text-white text-center sm:min-w-20 md:min-w-30">Devolucion</th>
                            <th className="sm:px-2 py-3 bg-gray-800 text-white text-center sm:min-w-20 md:min-w-30"></th>
{/*                             <th className="sm:px-2 py-3 bg-gray-800 text-white text-center sm:min-w-20 md:min-w-30">CurrentTime</th>
 */}
                        </tr>
                    </thead>
                    {/* Cuerpo de la tabla */}
                    <tbody>
                        {currentData.filter(item => item.state == 'ACEPTADO').length === 0 ? (
                            <tr>
                                <td colSpan="8" className="text-center py-4 text-gray-500">No existen reservas por el momento.</td>
                            </tr>
                        ) : (
                            currentData.map((item, index) => (
                                <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                    <td className="px-6 py-4 whitespace-nowrap bg-gray-300">
                                        {item.type === 'book' ? (<p>Libro</p>) : (<p>Equipo</p>)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">{item.studentName}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{item.categoryName}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {item.type === 'equipment' ? (
                                            <p>{formattedDate(item.reservationDateTime)}, {parseCustomTime(item.endHour)}</p>
                                        ) : (
                                            <p>{formattedDate(item.returnDate)}</p>
                                        )}
                                    </td>

                                    <td className="px-6 py-4 whitespace-nowrap">{item.verificationCode}</td>
                                    <td className="text text-center px-6 py-4 whitespace-nowrap">
                                        <p style={{ color: getEstadoDevolucion(item) === 'EN PLAZO' ? 'green' : 'red' }}>
                                            {getEstadoDevolucion(item)}
                                        </p>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <button type="button" onClick={() => handleCheckmarkClick(item._id, item.type, item.type === 'book' ? item.bookId : item.equipmentId)}>
                                                <CheckmarkSharp
                                                    color={'green'}
                                                    beat
                                                    title="Subir icono 1"
                                                    height="50px"
                                                    width="50px"
                                                />
                                            </button>

                                            {/*                                         <button type="button">
                                            <CloseSharp
                                                color={'red'}
                                                beat
                                                title="Subir icono 2"
                                                height="50px"
                                                width="50px"
                                            />
                                        </button> */}
                                        </div>
                                    </td>
{/*                                     <td>{new Date(item.currentTime).toLocaleString()}</td>
 */}
                                    <td className="px-4 whitespace-nowrap">
                                        <button type="button" onClick={() => handleEditDevolucionClick(item._id, item.type)}>
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                                                <path d="M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 0 0 0-3.712ZM19.513 8.199l-3.712-3.712-8.4 8.4a5.25 5.25 0 0 0-1.32 2.214l-.8 2.685a.75.75 0 0 0 .933.933l2.685-.8a5.25 5.25 0 0 0 2.214-1.32l8.4-8.4Z" />
                                                <path d="M5.25 5.25a3 3 0 0 0-3 3v10.5a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3V13.5a.75.75 0 0 0-1.5 0v5.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5V8.25a1.5 1.5 0 0 1 1.5-1.5h5.25a.75.75 0 0 0 0-1.5H5.25Z" />
                                            </svg>
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

        </div>
    );
};

export default TableDevolucionDeEquipos;
