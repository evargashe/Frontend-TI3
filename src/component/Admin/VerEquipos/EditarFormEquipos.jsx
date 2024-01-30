import React, { useState, useEffect } from "react";
import axios from 'axios';
import { toast } from 'react-toastify';

const EditForm = ({ equipmentId, onClose, onSave }) => {
    const [nuevoFormulario, setNuevoFormulario] = useState({
        name: '',
        components: '',
        amount: '',
        state: '',
    });


    useEffect(() => {
        console.log('Valor de equipmentId:', equipmentId);
        axios.get(`http://localhost:4000/api/admin/get/equipments/${equipmentId}`)
            .then(response => {
                console.log('Datos del equipo obtenidos:', response.data);
                setNuevoFormulario(response.data);
            })
            .catch(error => console.error('Error al obtener los datos del equipo:', error));
    }, [equipmentId]);


    const handleNuevoChange = (e) => {
        const { name, value } = e.target;
        setNuevoFormulario((prevNuevoFormulario) => ({
            ...prevNuevoFormulario,
            [name]: value,
        }));
    };


    const handleSubmitEquipos = (e) => {
        e.preventDefault();
        axios.put(`http://localhost:4000/api/admin/update/equipments/${equipmentId}`, nuevoFormulario)
            .then(response => {
                onSave(response.data);
                toast.success("¡Equipo actualizado con éxito!", {
                    position: toast.POSITION.BOTTOM_RIGHT,
                    autoClose: 3000,
                });
                onClose();
            })
            .catch(error => {
                console.error('Error al actualizar el equipo:', error);
                toast.error("Error al actualizar el equipo", {
                    position: toast.POSITION.BOTTOM_RIGHT,
                    autoClose: 3000,
                });
            });
        console.log(nuevoFormulario);
    };


    const handleCancelar = () => {
        onClose();
    };

    return (
        <div className="hero min-h-screen">
            <form onSubmit={handleSubmitEquipos} className="max-w-lg mx-auto bg-white p-8 border rounded shadow">
                <div className="mb-4">
                    <label htmlFor="name" className="block text-gray-700 font-bold mb-2">
                        Nombre
                    </label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={nuevoFormulario.name}
                        onChange={handleNuevoChange}
                        className="w-full p-2 border rounded"
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="components" className="block text-gray-700 font-bold mb-2">
                        Componentes
                    </label>
                    <textarea
                        id="components"
                        name="components"
                        value={nuevoFormulario.components}
                        onChange={handleNuevoChange}
                        className="w-full p-2 border rounded"
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="amount" className="block text-gray-700 font-bold mb-2">
                        Cantidad
                    </label>
                    <input
                        type="number"
                        id="amount"
                        name="amount"
                        value={nuevoFormulario.amount}
                        onChange={handleNuevoChange}
                        className="w-full p-2 border rounded"
                    />
                </div>
                <div className="mb-2">
                    <label htmlFor="state" className="block text-gray-700 font-bold mb-2">
                        Estado
                    </label>
                    <select
                        id="state"
                        name="state"
                        value={nuevoFormulario.state}
                        onChange={handleNuevoChange}
                        className="w-full p-2 border rounded"
                    >
                        <option value="">Seleccione un Estado</option>
                        <option value="DISPONIBLE">DISPONIBLE</option>
                        <option value="MANTENIMIENTO">MANTENIMIENTO</option>
                    </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="flex justify-start">
                        <div>
                            <button
                                type="submit"
                                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                            >
                                Actualizar
                            </button>
                        </div>
                    </div>
                    <div className="flex justify-end">
                        <button
                            type="button"
                            onClick={handleCancelar}
                            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                        >
                            Cancelar
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}

export default EditForm;
