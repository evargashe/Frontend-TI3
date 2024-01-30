import React, { useState, useEffect } from 'react';
import "react-toastify/dist/ReactToastify.css";
import WeekRangeComponent from '../../component/Cliente/HomeReservar/GetDay.jsx';
import SeleccionEquipos from '../../component/SeleccionEquipos.jsx';
import VerLibros from '../../component/Cliente/HomeReservar/VerLibros.jsx';
import VerEquipos from '../../component/Cliente/HomeReservar/VerEquipos.jsx';


const ReservarForm = (props) => {


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
          <h2 className="text-center text-2xl font-bold text-gray-800 mb-4">Seleccione lo que desea Reservar</h2>
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
            <div className="flex justify-end mr-14 mt-4">
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
            <div className="flex justify-end mr-14 mt-4">
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
  };

  return (
    <div>
      <div>
        <div className='text-center mb-4'>
          <WeekRangeComponent />
        </div>
      </div>
      <div>
        {renderForm()}
      </div>
    </div>
  );
};

export default ReservarForm;
