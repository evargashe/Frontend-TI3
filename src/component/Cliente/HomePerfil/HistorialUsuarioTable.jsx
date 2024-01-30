import React, { useState, useEffect } from 'react';
import formattedDate from '../../Admin/DevolucionDeEquipos/FormattedDate';
import parseCustomTime from '../../Admin/DevolucionDeEquipos/parseCustomTime';
import getEstadoDevolucion from '../../Admin/Reportes/getEstadoDevolucion';
import ReactPaginate from 'react-paginate';
const getColorPorEstado = (estado) => {
    switch (estado) {
        case 'ACEPTADO':
            return 'green';
        case 'RECHAZADO':
            return 'red';
        case 'PENDIENTE':
            return 'blue';
        default:
            return 'black'; // o el color predeterminado que desees
    }
};


function HistorialUsuarioTable({ userHistory, itemDetails, currentData, pageCountReserva, handlePageClickReserva }) {
    const [currentPage, setCurrentPage] = useState(0);
    const [showReportes, setShowReportes] = useState(true); // State to toggle between reportes and reservas
    const itemsPerPage = 5; // Número de elementos por página
    const [localUserHistory, setLocalUserHistory] = useState(userHistory);
    const [localCurrentData, setLocalCurrentData] = useState(currentData);


    useEffect(() => {
        // Actualiza los datos locales cuando `userHistory` cambia
        setLocalUserHistory(userHistory);
    }, [userHistory]);

    useEffect(() => {
        // Actualiza los datos locales cuando `currentData` cambia
        setLocalCurrentData(currentData);
    }, [currentData]);

    
    const handlePageClick = ({ selected }) => {
        setCurrentPage(selected);
    };

    const offset = currentPage * itemsPerPage;
    const currentItems = localUserHistory.slice(offset, offset + itemsPerPage);

    const pageCount = Math.ceil(localUserHistory.length / itemsPerPage);
    return (
        <div className="flex flex-col items-center h-screen">
            <div>
                <button
                    onClick={() => setShowReportes(true)}
                    className={`${showReportes
                        ? 'bg-green-500 hover:bg-green-700'
                        : 'bg-gray-500 hover:bg-gray-700'
                        } text-white font-bold py-2 px-4 rounded-full`}
                >
                    Mostrar Reportes
                </button>
                <button
                    onClick={() => setShowReportes(false)}
                    className={`${!showReportes
                        ? 'bg-red-500 hover:bg-red-700'
                        : 'bg-gray-500 hover:bg-gray-700'
                        } text-white font-bold py-2 px-4 rounded-full ml-4`}
                >
                    Mostrar Reservas
                </button>
            </div>

            {showReportes ? (
                <div>

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
                    <table className="w-full table-auto mt-4">
                        <thead>
                            <tr>
                                <th className="sm:px-2 py-3 bg-gray-800 text-white text-center sm:min-w-20 md:min-w-30">Fecha de entrega</th>
                                <th className="sm:px-2 py-3 bg-gray-800 text-white text-center sm:min-w-20 md:min-w-30">Fecha de devolucion</th>
                                <th className="sm:px-2 py-3 bg-gray-800 text-white text-center sm:min-w-20 md:min-w-30">Categoria</th>
                                <th className="sm:px-2 py-3 bg-gray-800 text-white text-center sm:min-w-20 md:min-w-30">Nombre del Equipo/Libro</th>
                                <th className="sm:px-2 py-3 bg-gray-800 text-white text-center sm:min-w-20 md:min-w-30">Estado</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentItems.length === 0 ? (
                                // Show a message when no matches are found
                                <tr>
                                    <td colSpan="5" className="text-center py-4 text-gray-500">
                                        No se encontraron reportes en la tabla.
                                    </td>
                                </tr>
                            ) : (
                                currentItems.map((item, index) => (
                                    <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                        <td className="px-6 py-4 whitespace-nowrap">{item.itemType === 'Book' ? (<p>{formattedDate(item.returnDate)}</p>) : (<p>{formattedDate(item.returnDate) + ' ' + parseCustomTime(item.endHour)}</p>)}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{new Date(item.currentTime).toLocaleString()}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{item.itemType === 'Book' ? (<p>Libro</p>) : (<p>Equipo</p>)}</td>

                                        <td className="px-6 py-4 whitespace-nowrap overflow-hidden overflow-ellipsis">
                                            <div style={{ maxWidth: "200px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>

                                                {itemDetails[item.itemId] ? (
                                                    item.itemType === 'Book' ? (
                                                        itemDetails[item.itemId].title
                                                    ) : (
                                                        itemDetails[item.itemId].name
                                                    )
                                                ) : 'Detalles no disponibles'}
                                            </div>
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
            ) : (

                <div>
                    <div className="mt-4 flex justify-center">
                        <ReactPaginate
                            previousLabel={<span className="px-2 py-1 rounded border border-gray-300 bg-white">Anterior</span>}
                            nextLabel={<span className="px-2 py-1 rounded border border-gray-300 bg-white">Siguiente</span>}
                            breakLabel={<span className="px-2 py-1 rounded border border-gray-300 bg-white">...</span>}
                            pageCount={pageCountReserva}
                            marginPagesDisplayed={2}
                            pageRangeDisplayed={5}
                            onPageChange={handlePageClickReserva}
                            containerClassName={'pagination flex justify-center'}
                            subContainerClassName={'pages flex'}
                            activeClassName={'active'}
                            pageClassName={'px-2 py-1 rounded border border-gray-300 bg-white'}
                            pageLinkClassName={'text-gray-800'}
                        />
                    </div>
                    <table className="w-full table-auto mt-4">
                        {/* Encabezado de la tabla */}
                        <thead>
                            <tr>
                                {/*Equipo/Libro  , Estudiante , Fecha en la que deberia ser devuelta , Codigo , Devuelto y tambien edaitar donde se va cambiar la fecha de entrega*/}
                                <th className="sm:px-2 py-3 bg-gray-800 text-white text-center sm:min-w-20 md:min-w-30">Categoria</th>
                                <th className="sm:px-2 py-3 bg-gray-800 text-white text-center sm:min-w-20 md:min-w-30">Nombre de la categoria</th>
                                <th className="sm:px-2 py-3 bg-gray-800 text-white text-center sm:min-w-20 md:min-w-30">Fecha de entrega</th>
                                <th className="sm:px-2 py-3 bg-gray-800 text-white text-center sm:min-w-20 md:min-w-30">Codigo</th>
                                <th className="sm:px-2 py-3 bg-gray-800 text-white text-center sm:min-w-20 md:min-w-30">Estado</th>
                            </tr>
                        </thead>
                        {/* Cuerpo de la tabla */}
                        <tbody>
                            {currentData.filter(item => item.state == 'ACEPTADO').length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="text-center py-4 text-gray-500">No existen reservas por el momento.</td>
                                </tr>
                            ) : (
                                currentData.map((item, index) => (
                                    <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                        <td className="px-6 py-4 whitespace-nowrap bg-gray-300">
                                            {item.type === 'book' ? (<p>Libro</p>) : (<p>Equipo</p>)}
                                        </td>
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
                                            <p style={{ color: getColorPorEstado(item.state) }}>
                                                {item.state}
                                            </p>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>

                </div>
            )}
        </div>


    );
}

export default HistorialUsuarioTable;