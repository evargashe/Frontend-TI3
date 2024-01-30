import React, { useState } from 'react';
import Equipo from 'flat-color-icons/svg/multiple_smartphones.svg';
import Libro from 'flat-color-icons/svg/reading.svg';
import styles from '../page/Cliente/styles/HomeReservar.module.css';
import Reservar from '../page/Cliente/HomeReservar.jsx';

const SeleccionEquipos = ({ handleTipoChange, tipo, setMostrarFormulario }) => {
    const handleTipoChangeLocal = (tipoSeleccionado) => {
        setMostrarFormulario(true);
        handleTipoChange(tipoSeleccionado);
    };

    return (
        <div>
            <div className={`${styles.infoContainer} flex mb-4`}>
                <div>
                    <img src={Libro} alt="Ver equipos" />

                    <button
                        className={`w-full ${tipo === 'Libros' ? 'bg-blue-500' : 'bg-gray-300'} text-white py-2 px-4 rounded-md mb-2`}
                        onClick={() => handleTipoChangeLocal('Libros')}
                    >
                        Libros
                    </button>
                </div>
                <div>
                    <img src={Equipo} alt="Ver equipos" />
                    <button
                        className={`w-full ${tipo === 'Equipos' ? 'bg-blue-500' : 'bg-gray-300'} text-white py-2 px-4 rounded-md mb-2`}
                        onClick={() => handleTipoChangeLocal('Equipos')}
                    >
                        Equipos
                    </button>
                </div>
            </div>
        </div>
    );
}

export default SeleccionEquipos;