import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import EquiposTable from '../../component/Cliente/VerEquipo/verEquipos.jsx';
import LibrosTable from '../../component/Cliente/VerEquipo/verLibros.jsx';

const TableEquiposLibros = () => {
  const [currentTable, setCurrentTable] = useState('equipos');

  return (
    <div>
      <div className="max-w-screen-xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg">
        <div className='text-center lg:text-center'>
          <p className='text-3xl font-bold mb-4'>Lista de los Equipos/Libros de la escuela</p>

          <div className="flex mb-4">
            <button
              type="button"
              className={`${currentTable === 'equipos' ? 'bg-gray-400' : 'bg-gray-200'
                } hover:bg-gray-600 text-white flex-1 py-2 rounded-md transition duration-300 ease-in-out mr-2`}
              onClick={() => setCurrentTable('equipos')}
            >
              Equipos
            </button>
            <button
              type="button"
              className={`${currentTable === 'libros' ? 'bg-gray-400' : 'bg-gray-200'
                } hover.bg-gray-600 text-white flex-1 py-2 rounded-md transition duration-300 ease-in-out`}
              onClick={() => setCurrentTable('libros')}
            >
              Libros
            </button>
          </div>
        </div>

        {currentTable === 'equipos' && <EquiposTable />}
        {currentTable === 'libros' && <LibrosTable />}
      </div>
      <div className="flex justify-end mr-14 mt-4">
        <Link to="/client/reservar" className="bg-blue-600 text-white rounded p-2">
          Reservar Horario
        </Link>
      </div>
    </div>
  );
};

export default TableEquiposLibros;
