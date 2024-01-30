import React, { useState } from 'react';
import axios from 'axios';

import { toast } from 'react-toastify';

const formatDate = (dateString) => {
    // Verificar si dateString es un valor válido
    if (!dateString || isNaN(new Date(dateString).getTime())) {
        return '';  // Devolver una cadena vacía o algún valor predeterminado si no es válido
    }

    const date = new Date(dateString);
    const formattedDate = date.toISOString().split('T')[0];
    return formattedDate;
};

const ModalEditar = ({ item, onClose  }) => {
    const [formData, setFormData] = useState({
        returnDate: formatDate(item.returnDate),
        reservationDateTime: formatDate(item.reservationDateTime),
        endHour: item.endHour
    });

    const handleBook = async (e) => {
        e.preventDefault();
    
        try {
            const response = await axios.put(`${import.meta.env.VITE_REACT_APP_API_KEY}/api/admin/updateReservationDevolution/${item.type}/${item._id}`, {
                returnDate: formData.returnDate
            });
            toast.success(`Libro actualizado exitosamente!`, {
                position: toast.POSITION.BOTTOM_RIGHT,
                autoClose: 1000, // 3 segundos
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            onClose();  // Cierra el modal después de la actualización
        } catch (error) {
            console.error('Error al actualizar reserva de libros:', error);
            // Manejar el error, mostrar un mensaje al usuario, etc.
        }
    };

    const handleChangeBook = (e) => {
        setFormData({ ...formData, returnDate: e.target.value });
    };

    const handleEquipment = async (e) => {
        e.preventDefault();
    
        try {
            console.log(item._id);
            console.log(formData.reservationDateTime);
            console.log(item.endHour);
            const response = await axios.put(`${import.meta.env.VITE_REACT_APP_API_KEY}/api/admin/updateReservationDevolution/${item.type}/${item._id}`, {
                reservationDateTime: formData.reservationDateTime,
                endHour: formData.endHour
            });
            toast.success(`Equipo actualizado exitosamente!`, {
                position: toast.POSITION.BOTTOM_RIGHT,
                autoClose: 1000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            onClose();  // Cierra el modal después de la actualización
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        } catch (error) {
            console.error('Error al actualizar reserva de equipo:', error);
            // Manejar el error, mostrar un mensaje al usuario, etc.
        }
    };

    const handleChangeEquipment = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    return (
        <div className="max-w-lg mx-auto bg-white p-5 border rounded shadow">
            {item.type === 'book' ? (
                <form onSubmit={handleBook}>
                    <div className="mb-4 block text-gray-700 font-bold">
                        <h5>Actualizar Fecha de Reserva de Libros</h5>
                    </div>
                    <div className="mb-4">
                        <label htmlFor="returnDate" className="block text-gray-700 font-bold mb-2">
                            Cambiar fecha de entrega
                        </label>
                        <input
                            type="date"
                            id="returnDate"
                            name="returnDate"
                            value={formData.returnDate}
                            onChange={handleChangeBook}
                            className="w-full p-2 border rounded"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex justify-center">
                            <button
                                type="submit"
                                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                            >
                                Actualizar
                            </button>
                        </div>
                        <div className="flex justify-center">
                            <button className="modal-close text-white bg-red-500 p-2 rounded" onClick={onClose}>
                                Cancelar
                            </button>
                        </div>
                    </div>
                </form>
            ) : (
                <form onSubmit={handleEquipment}>
                    <div className="mb-4 block text-gray-700 font-bold">
                        <h5>Actualizar Fecha y Hora del Reserva de Equipos</h5>
                    </div>
                    <div className="mb-4">
                        <label htmlFor="reservationDateTime" className="block text-gray-700 font-bold mb-2">
                            Cambiar fecha de entrega
                        </label>
                        <input
                            type="date"
                            id="reservationDateTime"
                            name="reservationDateTime"
                            value={formData.reservationDateTime}
                            onChange={handleChangeEquipment}
                            className="w-full p-2 border rounded"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="endHour" className="block text-gray-700 font-bold mb-2">
                            Cambiar hora de entrega
                        </label>
                        <input
                            type="time"
                            id="endHour"
                            name="endHour"
                            value={formData.endHour}
                            onChange={handleChangeEquipment}
                            className="w-full p-2 border rounded"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex justify-center">
                            <button
                                type="submit"
                                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                            >
                                Actualizar
                            </button>
                        </div>
                        <div className="flex justify-center">
                            <button className="modal-close text-white bg-red-500 p-2 rounded" onClick={onClose}>
                                Cancelar
                            </button>
                        </div>
                    </div>
                </form>
            )}
        </div>
    );
};

export default ModalEditar;
