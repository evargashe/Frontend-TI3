import React, { useState, useEffect } from 'react';
import ReactPaginate from 'react-paginate';
import './styles/HomePaginationStyles.css';
import axios from 'axios';
import getEstadoDevolucion from '../../component/Admin/Reportes/getEstadoDevolucion';
import formattedDate from '../../component/Admin/DevolucionDeEquipos/FormattedDate';
import parseCustomTime from '../../component/Admin/DevolucionDeEquipos/parseCustomTime';

const TableReporte = () => {

    const [historyData, setHistoryData] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    

    const handlePageClick = ({ selected }) => {
        setCurrentPage(selected);
    };

    const [itemDetails, setItemDetails] = useState({});

    useEffect(() => {
        // Llamar al endpoint del servidor para obtener el historial de usuarios
        axios.get('http://localhost:4000/api/admin/user-history')
            .then(response => {
                setHistoryData(response.data);
                // Obtener detalles de cada elemento en el historial y almacenarlos en el estado
                response.data.forEach(item => {
                    const correctType = item.itemType == 'Book' ? 'books' : 'equipments'
                    axios.get(`http://localhost:4000/api/admin/getDetails/${correctType}/${item.itemId}`)
                        .then(detailsResponse => {
                            setItemDetails(prevState => ({
                                ...prevState,
                                [item.itemId]: {
                                    name: detailsResponse.data.title || detailsResponse.data.name
                                },
                            }));
                        })
                        .catch(error => {
                            console.error(`Error al obtener detalles del item ${item.itemType} con ID ${item.itemId}:`, error.response ? error.response.data : error.message);
                        });
                    // Obtener detalles del estudiante
                    if (item.userId) {
                        axios.get(`http://localhost:4000/api/admin/getStudent/${item.userId}`)
                            .then(studentResponse => {
                                setItemDetails(prevState => ({
                                    ...prevState,
                                    [item.userId]: {
                                        userName: studentResponse.data.firstname +' '+ studentResponse.data.lastname,
                                    },
                                }));
                            })
                            .catch(error => {
                                console.error(`Error al obtener detalles del estudiante con ID ${item.userId}:`, error.response ? error.response.data : error.message);
                            });
                    }
                });
            })
            .catch(error => {
                console.error('Error al obtener el historial en el frontend:', error);
            });
    }, []);


    const filteredData = historyData.filter(item => {
        const userName = itemDetails[item.userId] && itemDetails[item.userId].userName;
        return userName && userName.toLowerCase().includes(searchTerm.toLowerCase());
    });

    const [currentPage, setCurrentPage] = useState(0); // Estado para rastrear la página actual
    const itemsPerPage = 10; // Número de elementos por página
    const pageCount = Math.ceil(filteredData.length / itemsPerPage); // Cálculo del número total de páginas

    const offset = currentPage * itemsPerPage;
    const currentData = filteredData.slice(offset, offset + itemsPerPage);
    return (
        <div className="max-w-screen-xl mx-auto mt-2 p-2 bg-white rounded-lg shadow-lg">
            <div className='text text-center'>
                <p className='text-3xl font-bold mb-4'>Reportes</p>


            </div>
            <div>
                <input
                    type="text"
                    placeholder="Buscar por nombre de Estudiante o por nombre de Equipo/Libro"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300 mb-4"
                />
            </div>
            <div className="overflow-x-auto">
                <div className="flex justify-center">
                    <ReactPaginate
                        previousLabel={
                            <span className="px-2 py-1 rounded border border-gray-300 bg-white">
                                Anterior
                            </span>
                        }
                        nextLabel={
                            <span className="px-2 py-1 rounded border border-gray-300 bg-white">
                                Siguiente
                            </span>
                        }
                        breakLabel={
                            <span className="px-2 py-1 rounded border border-gray-300 bg-white">...</span>
                        }
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
                    <thead>
                        <tr>

                            <th className="sm:px-2 py-3 bg-gray-800 text-white text-center sm:min-w-20 md:min-w-30">Solicitante</th>
                            <th className="sm:px-2 py-3 bg-gray-800 text-white text-center sm:min-w-20 md:min-w-30">Fecha de entrega</th>
                            <th className="sm:px-2 py-3 bg-gray-800 text-white text-center sm:min-w-20 md:min-w-30">Fecha de devolucion</th>
                            <th className="sm:px-2 py-3 bg-gray-800 text-white text-center sm:min-w-20 md:min-w-30">Categoria</th>
                            <th className="sm:px-2 py-3 bg-gray-800 text-white text-center sm:min-w-20 md:min-w-30">Id de la categoria</th>
                            <th className="sm:px-2 py-3 bg-gray-800 text-white text-center sm:min-w-20 md:min-w-30">Nombre del Equipo/Libro</th>
                            <th className="sm:px-2 py-3 bg-gray-800 text-white text-center sm:min-w-20 md:min-w-30">Estado</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentData.length === 0 ? (
                            // Show a message when no matches are found
                            <tr>
                                <td colSpan="5" className="text-center text-gray-600 my-4">
                                    No se encontraron coincidencias en la tabla.
                                </td>
                            </tr>
                        ) : (

                            currentData.map((item, index) => (
                                <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                    <td className="px-6 py-4 whitespace-nowrap bg-gray-300">
                                        {itemDetails[item.userId] && itemDetails[item.userId].userName
                                            ? `${itemDetails[item.userId].userName}`
                                            : 'No details available'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">{item.itemType === 'Book' ? (<p>{formattedDate(item.returnDate)}</p>) : (<p>{formattedDate(item.returnDate) + ' ' + parseCustomTime(item.endHour)}</p>)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{new Date(item.currentTime).toLocaleString()}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{item.itemType === 'Book' ? (<p>Libro</p>) : (<p>Equipo</p>)}</td>

                                    <td className="px-6 py-4 whitespace-nowrap">{item.itemId}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {itemDetails[item.itemId] ? itemDetails[item.itemId].name : 'No details available'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <p style={{ color: getEstadoDevolucion(item, item.currentTime) === 'ENTREGA A TIEMPO' ? 'green' : 'red' }}>
                                            {getEstadoDevolucion(item, item.currentTime)}
                                        </p>
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

export default TableReporte;
