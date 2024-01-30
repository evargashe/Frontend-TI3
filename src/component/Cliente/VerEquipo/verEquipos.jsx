import React, { useState, useEffect } from 'react';
import ReactPaginate from 'react-paginate';
import equiposData from './ImgEquipos.json'

const EquiposTable = () => {
    const [currentPage, setCurrentPage] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');

    const itemsPerPage = 10;

    //Backend
    const [equipos, setEquipos] = useState([]);
    useEffect(() => {
        const fetchEquipos = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_REACT_APP_API_KEY}/api/students/view-equipments/equipments`);
                const data = await response.json();
                setEquipos(data);
            } catch (error) {
                console.error("Error fetching equipos:", error);
            }
        };
        fetchEquipos();
    }, []);



    const normalizeString = (str) => {
        return str
            ? str
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
                .toLowerCase()
            : "";
    };
    // Filtrar libros basados en el término de búsqueda
    const filteredEquipos = equipos.filter(
        (item) =>
        (item.name &&
            normalizeString(item.name.toLowerCase()).includes(normalizeString(searchTerm.toLowerCase())))
    );


    const pageCount = Math.ceil(filteredEquipos.length / itemsPerPage);
    const handlePageClick = ({ selected }) => {
        setCurrentPage(selected);
    };

    const offset = currentPage * itemsPerPage;
    const currentItems = filteredEquipos.slice(offset, offset + itemsPerPage);

    return (
        <div>
            {/* Agregar campo de búsqueda */}
            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Buscar por nombre"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="text text-center w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300 mb-4"
                />
            </div>
            <div className="overflow-x-auto">
                <table className="w-full table-auto">
                    <thead>
                        <tr>
                            <th className="px-6 py-3 bg-blue-500 text-white text-left">Imagen</th>
                            <th className="px-6 py-3 bg-blue-500 text-white text-left">Nombre</th>
                            <th className="px-6 py-3 bg-blue-500 text-white text-left">Cantidad</th>
                            <th className="px-6 py-3 bg-blue-500 text-white text-left">Componentes</th>
                            <th className="px-6 py-3 bg-blue-500 text-white text-left">Estado</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentItems.map((item, index) => {
                            // Convertir objetos numerados en un array
                            const equiposArray = Object.values(equiposData.Equipos);

                            // Buscar la correspondencia en el array
                            const equipo = equiposArray.find((equipo) => equipo.Nombre === item.name);
                            return (
                                <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {equipo ? (
                                            // Mostrar la imagen si se encuentra la correspondencia en el JSON Equipos
                                            <a href={equipo.Foto} target="_blank" rel="noopener noreferrer">
                                                <img
                                                    src={equipo.Foto}
                                                    alt={equipo.Nombre}
                                                    className="max-w-full h-auto"
                                                    width={130}  // Ajusta este valor según tus necesidades
                                                    height={130} // Ajusta este valor según tus necesidades
                                                />
                                            </a>
                                        ) : (
                                            // Mostrar un mensaje de error o imagen de reserva si no se encuentra la correspondencia
                                            <a href='https://previews.123rf.com/images/vectorwin/vectorwin2101/vectorwin210100881/162435111-no-hay-foto-tachada-vector-de-icono-de-glifo-de-signo-no-hay-foto-tachada-s%C3%ADmbolo-de-contorno.jpg' target="_blank" rel="noopener noreferrer">

                                                <img
                                                    src="https://previews.123rf.com/images/vectorwin/vectorwin2101/vectorwin210100881/162435111-no-hay-foto-tachada-vector-de-icono-de-glifo-de-signo-no-hay-foto-tachada-s%C3%ADmbolo-de-contorno.jpg" // Reemplaza con la ruta de tu imagen de reserva
                                                    alt="Imagen de Reserva"
                                                    className="max-w-full h-auto"
                                                    width={130}  // Ajusta este valor según tus necesidades
                                                    height={130} // Ajusta este valor según tus necesidades
                                                />
                                            </a>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap bg-gray-300">{item.name}</td>
                                    <td className="text-center px-6 py-4 whitespace-nowrap">{item.amount}</td>
                                    <td className="px-6 py-4 whitespace-nowrap overflow-hidden overflow-ellipsis">
                                        <div style={{ maxWidth: "300px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} title={item.components}>
                                            {item.components}
                                        </div>
                                    </td>

                                    <td className="px-6 py-4 whitespace-nowrap">{item.state}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
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
        </div>
    );
};

export default EquiposTable;
