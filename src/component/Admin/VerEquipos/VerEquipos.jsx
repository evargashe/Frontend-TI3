import React, { useState, useEffect } from 'react';
import ReactPaginate from 'react-paginate';
import axios from 'axios';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import EditForm from './EditarFormEquipos';
import Edit from './assets/edit-3.svg';
import Delete from './assets/trash-2.svg';

const VerEquipos = () => {
    const [currentPage, setCurrentPage] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const itemsPerPage = 5;

    // Datos de ejemplo para la tabla (puedes reemplazar esto con tu lógica de obtención de datos)
    const [equipos, setEquipos] = useState([]);


    // MODAL
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedEquipmentId, setSelectedEquipmentId] = useState(null);


    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_REACT_APP_API_KEY}/api/admin/get/equipments`);
                setEquipos(response.data);
            } catch (error) {
                console.error('Error al obtener los equipos:', error);
            }
        };
        fetchData();
    }, []);

    const normalizeString = (str) => {
        return str ? str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase() : "";
    };

    // Filtrar equipos basados en el término de búsqueda
    const searchTermKeywords = normalizeString(searchTerm.toLowerCase()).split(' ');
    const filteredEquipos = equipos.filter((item) => {
        const combinedFields = Object.values(item)
            .filter((val) => typeof val === 'string' || typeof val === 'number')
            .map((val) => normalizeString(val.toString()))
            .join(' ');

        const includesSearchTerm = searchTermKeywords.every((keyword) => combinedFields.includes(keyword));
        return includesSearchTerm;
    });

    const pageCount = Math.ceil(filteredEquipos.length / itemsPerPage);

    const handlePageClick = ({ selected }) => {
        setCurrentPage(selected);
    };

    const offset = currentPage * itemsPerPage;
    const currentItems = filteredEquipos.slice(offset, offset + itemsPerPage);

    //EDITAR
    const handleEdit = (itemId) => {
        setShowEditModal(true);
        setSelectedEquipmentId(itemId);
    };



    const handleEditFormClose = () => {
        setShowEditModal(false);
        setSelectedEquipmentId(null);
    };

    const handleEditFormSave = (updatedFormData) => {
        axios.put(`${import.meta.env.VITE_REACT_APP_API_KEY}/api/admin/update/equipments/${selectedEquipmentId}`, updatedFormData)
            .then((response) => {
                const updatedEquipos = equipos.map(equipment => (equipment._id === selectedEquipmentId ? response.data : equipment));
                setEquipos(updatedEquipos);
            })
            .catch((error) => {
                console.error('Error al actualizar el equipos:', error);
            });

        // Cerrar el modal después de guardar los cambios
        setShowEditModal(false);
        setSelectedEquipmentId(null);
    };

    // DELETE
    const handleDelete = async (itemId) => {
        // Lógica para manejar la eliminación del equipo con el ID itemId
        const confirmAction = await Swal.fire({
            title: `¿Estás seguro que deseas eliminar el Equipo?`,
            icon: 'warning', // Cambiar el icono a 'warning'
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Aceptar',
            cancelButtonText: 'Cancelar',
        });
        if (confirmAction.isConfirmed) {
            axios.delete(`${import.meta.env.VITE_REACT_APP_API_KEY}/api/admin/delete/equipments/${itemId}`)
                .then((response) => {
                    const updatedEquipos = equipos.filter(equipment => equipment._id !== itemId);
                    toast.success("¡Equipo eliminado con éxito!", {
                        position: toast.POSITION.BOTTOM_RIGHT,
                        autoClose: 3000,
                    });
                    setEquipos(updatedEquipos);
                })
                .catch((error) => {
                    console.error('Error al eliminar el equipo:', error);
                });
        }
    };


    return (
        <div>
            {/* Agregar campo de búsqueda */}
            <div>
                <input
                    type="text"
                    placeholder="Buscar por nombre"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="text text-center w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300 mb-4"
                />
            </div>

            {showEditModal && selectedEquipmentId && (
                <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-800 bg-opacity-75">
                    <EditForm equipmentId={selectedEquipmentId} onClose={handleEditFormClose} onSave={handleEditFormSave} />
                </div>
            )}

            <div className="overflow-x-auto max-h-96"> {/* Establecer una altura máxima */}
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
                    <thead>
                        <tr>
                            <th className="px-4 py-3 bg-gray-800 text-white text-center min-w-30">
                                <div className="max-w-xs overflow-hidden overflow-ellipsis whitespace-nowrap" title="Título">
                                    Nombre
                                </div>
                            </th>
                            <th className="sm:px-2 py-3 bg-gray-800 text-white text-center sm:min-w-20 md:min-w-25">Cantidad</th>
                            <th className="sm:px-2 py-3 bg-gray-800 text-white text-center sm:min-w-20 md:min-w-30">Componentes</th>
                            <th className="sm:px-2 py-3 bg-gray-800 text-white text-center sm:min-w-20 md:min-w-30">Estado</th>
                            <th className="sm:px-2 py-3 bg-gray-800 text-white text-center sm:min-w-20 md:min-w-20">Opción</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredEquipos.length === 0 ? (
                            // Show a message when no matches are found
                            <tr>
                                <td colSpan="5" className="text-center text-gray-600 my-4">
                                    No se encontraron coincidencias en la tabla.
                                </td>
                            </tr>
                        ) : (
                            currentItems.map((item, index) => (
                                <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                    <td className="px-6 py-4 whitespace-nowrap bg-gray-300 overflow-hidden overflow-ellipsis">
                                        <div style={{ maxWidth: "200px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} title={item.title}>
                                            {item.name}
                                        </div>
                                    </td>                                <td className="px-4 py-4">{item.amount}</td>
                                    <td className="px-6 py-4 whitespace-nowrap overflow-hidden overflow-ellipsis">
                                        <div style={{ maxWidth: "800px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} title={item.components}>
                                            {item.components}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap overflow-hidden overflow-ellipsis">
                                        <div style={{ maxWidth: "100px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} title={item.category}>
                                            {item.state}
                                        </div>
                                    </td>
                                    <td className="px-1 py-1">
                                        <button onClick={() => handleEdit(item._id)} className="px-5 py-1 rounded">
                                            <img src={Edit} alt="Edit" />
                                        </button>
                                        <button onClick={() => handleDelete(item._id)} className="px- py-1 rounded">
                                            <img src={Delete} alt="Delete" />
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

export default VerEquipos;
