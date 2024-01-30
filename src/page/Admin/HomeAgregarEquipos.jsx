import React, { useState, useEffect } from 'react';
import Logo from '../../assets/ce-epcc.png';
import { toast, ToastContainer } from 'react-toastify';
import styles from './styles/HomeAgregarEquipos.module.css';
import "react-toastify/dist/ReactToastify.css";
import SeleccionEquipos from '../../component/SeleccionEquipos';
import AgregarLibros from '../../component/Admin/AgregarEquipos/AgregarLibros.jsx';
import AgregarEquipos from '../../component/Admin/AgregarEquipos/AgregarEquipos.jsx';

const AgregarForm = () => {
    //SeleccionEquipos.jsx
    const [showSelectionButtons, setShowSelectionButtons] = useState(true);
    const [tipo, setTipo] = useState('');
    const [mostrarFormulario, setMostrarFormulario] = useState(false);

    const handleTipoChange = (tipoSeleccionado) => {
        setTipo(tipoSeleccionado);
        setMostrarFormulario(true);
        setShowSelectionButtons(false);
    };

    const renderForm = () => {
        if (showSelectionButtons) {
            return (
                <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg">
                    <h2 className="text-center text-2xl font-bold text-gray-800 mb-4">Seleccione lo que desea Agregar</h2>

                    <SeleccionEquipos
                        handleTipoChange={handleTipoChange}
                        tipo={tipo}
                        setMostrarFormulario={setMostrarFormulario}
                    />
                </div>
            );
        } else {
            if (tipo === 'Libros' && mostrarFormulario) {
                return (
                    <div>
                        <div className={`hero min-h-screen bg-white rounded-lg shadow-lg ${styles.hero}`}>
                            <div className={`${styles.card}`}>
                                <div className="flex justify-end">
                                    <button
                                        onClick={() => setShowSelectionButtons(true)}
                                        className="bg-red-500 text-white py-2 px-4 rounded hover:bg-gray-600"
                                    >
                                        Cancelar
                                    </button>
                                </div>
                                <h2 className="text-center text-2xl font-bold text-gray-800 mb-2">Agregar Libro</h2>
                                <AgregarLibros />

                            </div>
                        </div>
                    </div>
                );
            } else if (tipo === 'Equipos' && mostrarFormulario) {
                return (
                    <div>
                        <div className={`hero min-h-screen bg-white rounded-lg shadow-lg ${styles.hero}`}>
                            <div className={`${styles.card}`}>
                                <div className="flex justify-end">
                                    <button
                                        onClick={() => setShowSelectionButtons(true)}
                                        className="bg-red-500 text-white py-2 px-4 rounded hover:bg-gray-600"
                                    >
                                        Cancelar
                                    </button>
                                </div>
                                <h2 className="text-center text-2xl font-bold text-gray-800 mb-2">Agregar Equipo</h2>
                                <AgregarEquipos />
                            </div>
                        </div>
                    </div>
                );
            }
        }
    };

    return (
        <div>
            <div>
                {renderForm()}
            </div>
        </div>
    );
};

export default AgregarForm;
