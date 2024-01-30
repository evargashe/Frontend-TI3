import React, { useState, useEffect } from 'react';
import Logo from '../../assets/ce-epcc.png';
import { toast } from 'react-toastify';
import styles from './styles/HomeAgregarEquipos.module.css';
import "react-toastify/dist/ReactToastify.css";
import SeleccionEquipos from '../../component/SeleccionEquipos';


import VerEquipos from '../../component/Admin/VerEquipos/VerEquipos.jsx';
import VerLibros from '../../component/Admin/VerEquipos/VerLibros.jsx';

const verEquipos = () => {
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
                    <h2 className="text-center text-2xl font-bold text-gray-800">Seleccione lo que desea ver</h2>

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
                    <div className="hero min-h-screen bg-white rounded-lg shadow-lg">
                        <div className="justify-center h-screen">
                            <div className="flex-grow flex flex-col items-end">
                                <button
                                    onClick={() => setShowSelectionButtons(true)}
                                    className="bg-red-500 text-white py-2 px-4 rounded hover:bg-gray-600"
                                >
                                    Regresar a Selección
                                </button>
                                <div className="flex-grow flex flex-col items-center justify-center">
                                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Listado de Libros</h2>
                                    <VerLibros />
                                </div>
                            </div>
                        </div>
                    </div>

                );
            } else if (tipo === 'Equipos' && mostrarFormulario) {
                return (
                    <div className="hero min-h-screen bg-white rounded-lg shadow-lg">
                        <div className="justify-center h-screen">
                            <div className="flex-grow flex flex-col items-end">
                                <button
                                    onClick={() => setShowSelectionButtons(true)}
                                    className="bg-red-500 text-white py-2 px-4 rounded hover:bg-gray-600"
                                >
                                    Regresar a Selección
                                </button>
                                <div className="flex-grow flex flex-col items-center justify-center">
                                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Listado de Equipos</h2>
                                    <VerEquipos />
                                </div>
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

export default verEquipos;
