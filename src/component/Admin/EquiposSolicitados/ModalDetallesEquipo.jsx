import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const DetallesModal = ({ details, type, idReservation, stateReservation, id, onClose }) => {
    const [formulario, setFormulario] = useState({
        title: '',
        name: '',
        amount: '',
        state: '',
    });

    const [state, setState] = useState('');
    useEffect(() => {
        const correctedType = type === 'book' ? 'books' : 'equipments';
        axios.get(`${import.meta.env.VITE_REACT_APP_API_KEY}/api/admin/get/${correctedType}/${details}`)
            .then(response => {
                setFormulario(response.data);
            })
            .catch(error => console.error('Error al obtener los datos del libro:', error));
    }, [details]);


    const handleChange = (e) => {
        const { value } = e.target;
        setState(value); // Actualiza el estado con el nuevo valor
    };

    const handleSubmitReservation = async (e) => {
        e.preventDefault();

        try {
            const correctedType = type === 'book' ? 'books' : 'equipments';
            const correct = type === 'book' ? 'libro' : 'equipo';

            const response = await axios.post(`${import.meta.env.VITE_REACT_APP_API_KEY}/api/admin/update-reservation/${correctedType}/${idReservation}`, { reservationId: idReservation, newStatus: state });
            // Mostrar toast de éxito solo si la solicitud se completó sin errores
            toast.success('Estado de la reserva actualizado con éxito', {
                position: toast.POSITION.BOTTOM_RIGHT,
                autoClose: 1000, // Duración en milisegundos
            });
            onClose();
            setTimeout(() => {
                window.location.reload();
            }, 1000);
            await axios.put(`${import.meta.env.VITE_REACT_APP_API_KEY}/api/admin/update-state-item/${type}/${id}`);

        } catch (error) {
            if (error.response.status === 400) {
                // Manejar el error específico de código de estado 400
                console.error('Error 400:', error.response.data); // Muestra el mensaje de error proporcionado por el servidor
            } else {
                // Manejar otros errores
                console.error('Error al actualizar el estado de la reserva:', error.response?.data?.msg || error.message || 'Error desconocido');
            }
        }
    };
    return (
        <div className="bg-white p-5 border rounded shadow">
            {type === 'book' ? (<h2 className="text text-center text-2xl font-bold">Detalles del Libro</h2>) :
                (<h2 className="text text-center text-2xl font-bold">Detalles del Equipo</h2>)}
            <div className="grid">
                <div className="mb-2">
                    <label htmlFor="title" className="block text-gray-700 font-bold mb-2">
                        Nombre de la Categoria
                    </label>
                    {type === 'book' ? (
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={formulario.title}
                            className="w-full bg-gray-200 text-gray-700 p-2 rounded cursor-not-allowed"
                            readOnly
                        />) : (
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formulario.name}
                            className="w-full bg-gray-200 text-gray-700 p-2 rounded cursor-not-allowed"
                            readOnly
                        />)
                    }
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="mb-2">
                    <label htmlFor="title" className="block text-gray-700 font-bold mb-2">
                        Cantidad
                    </label>
                    <input
                        type="number"
                        id="amount"
                        name="amount"
                        value={formulario.amount}
                        className="w-full bg-gray-200 text-gray-700 p-2 rounded cursor-not-allowed"
                        readOnly
                    />
                </div>
                <div className="mb-2">
                    <label htmlFor="year" className="block text-gray-700 font-bold mb-2">
                        Estado
                    </label>
                    <input
                        type="text"
                        id="state"
                        name="state"
                        value={formulario.state}
                        className="w-full bg-gray-200 text-gray-700 p-2 rounded cursor-not-allowed"
                        readOnly
                    />
                </div>
            </div>
            <h2 className="text text-center text-2xl font-bold">Detalles de la Reserva</h2>
            <form onSubmit={handleSubmitReservation} className="max-w-lg mx-auto bg-white p-5 border rounded shadow">
                <div className="grid">
                    <div className="mb-2">
                        <label htmlFor="title" className="block text-gray-700 font-bold mb-2">
                            Cambiar estado de la Reserva
                        </label>
                        <select
                            id="state"
                            name="state"
                            value={state}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                        >
                            <option value={stateReservation}>{stateReservation}</option>
                            {stateReservation === 'PENDIENTE' && (
                                <>
                                    <option value="ACEPTADO">ACEPTADO</option>
                                    <option value="RECHAZADO">RECHAZADO</option>
                                </>
                            )}
                            {stateReservation === 'RECHAZADO' && (
                                <>
                                    <option value="PENDIENTE">PENDIENTE</option>
                                    <option value="ACEPTADO">ACEPTADO</option>
                                </>
                            )}
                            {stateReservation === 'ACEPTADO' && (
                                <>
                                    <option value="PENDIENTE">PENDIENTE</option>
                                    <option value="RECHAZADO">RECHAZADO</option>
                                </>
                            )}
                        </select>
                    </div>
                </div>

                <div className="flex justify-center">
                    <div>
                        <button
                            type="submit"
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                        >
                            Actualizar
                        </button>
                    </div>
                </div>
            </form>

            <div className="mt-4 flex justify-end">
                <button
                    onClick={onClose}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                    Cerrar
                </button>
            </div>
        </div>
    );
};

export default DetallesModal;
