import React, { useState, useEffect } from 'react';
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import "react-big-calendar/lib/css/react-big-calendar.css";
import WeekRangeComponent from '../../component/Cliente/HomeReservar/GetDay.jsx'
import SeleccionEquipos from '../../component/SeleccionEquipos.jsx';
import VerLibros from '../../component/Cliente/Horario/VerLibro.jsx';
import VerEquipos from '../../component/Cliente/Horario/VerEquipo.jsx';
import MostraBotones from '../../component/Cliente/Horario/MostrarBotones.jsx';


const Horario = (props) => {
    //SeleccionEquipos.jsx
    const [showSelectionButtons, setShowSelectionButtons] = useState(true);
    const [tipo, setTipo] = useState('');
    const [mostrarFormulario, setMostrarFormulario] = useState(false);

    const handleTipoChange = (tipoSeleccionado) => {
        setTipo(tipoSeleccionado);
        setMostrarFormulario(true);
        setShowSelectionButtons(false);
    };

    const renderHorario = () => {

        if (showSelectionButtons) {
            return (
                <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg">
                    <h2 className="text-center text-2xl font-bold text-gray-800 mb-4">Seleccione la categoria que desear ver</h2>
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
                        <div className="flex justify-end mr-20">
                            <button
                                onClick={() => setShowSelectionButtons(true)}
                                className="bg-gray-400 text-white py-2 px-4 rounded hover:bg-blue-600"
                            >
                                Regresar a la selección
                            </button>
                        </div>
                        <VerLibros />
                    </div>
                );
            } else if (tipo === 'Equipos' && mostrarFormulario) {
                return (
                    <div>
                        <div className="flex justify-end mr-20">
                            <button
                                onClick={() => setShowSelectionButtons(true)}
                                className="bg-gray-400 text-white py-2 px-4 rounded hover:bg-blue-600"
                            >
                                Regresar a la selección
                            </button>
                        </div>
                        <VerEquipos />
                    </div>
                );
            }
        }
    }
    return (
        <div>
            <div className='text-center'>
                <WeekRangeComponent />
            </div>
            <div>
                {renderHorario()}
            </div>
            {location.pathname === '/client/horario' && (
                <div>
                    <MostraBotones />
                </div>
            )}
        </div>
    );
};

export default Horario;
