import React, { useState, useEffect } from 'react';
import ReactPaginate from 'react-paginate';
import styles from '../../../page/Cliente/styles/HomeReservar.module.css';
import { toast } from 'react-toastify';
import { useUser } from '../../../context/UserContext';

const VerLibros = () => {
    const { userId } = useUser();
    const [formDataLibros, setFormDataLibros] = useState({
        fechaInicio: '',
        fechaFin: '',
    });

    const [selectedRow, setSelectedRow] = useState(null);
    const [currentPage, setCurrentPage] = useState(0);

    const [itemsPerPage, setItemsPerPage] = useState(10);


    const [libros, setLibros] = useState([]);
    const [searchTermLibros, setSearchTermLibros] = useState('');
    const [searchResultsLibros, setSearchResultsLibros] = useState([]);

    const handlePageClick = ({ selected }) => {
        setCurrentPage(selected);
    };

    const limpiarFormularioLibros = () => {
        setFormDataLibros({
            fechaInicio: '',
            fechaFin: '',
        });
        setSelectedRow(null);
    };

    const handleChangeLibros = (e) => {
        const { name, value } = e.target;
        setFormDataLibros({
            ...formDataLibros,
            [name]: value,
        });
    };

    const handleRowSelection = (libro) => {
        setSelectedRow((prevSelectedRow) =>
            prevSelectedRow && prevSelectedRow.title === libro.title ? null : libro
        );
    };


    const handleSubmitLibros = async (e) => {
        e.preventDefault();

        const camposVacios = Object.entries(formDataLibros).some(([key, value]) => value.trim() === '');

        if (camposVacios || !selectedRow) {
            toast.error("Por favor, ingrese y seleccione todos los campos", {
                position: toast.POSITION.BOTTOM_RIGHT,
                autoClose: 1000,
            });
            return;
        }
        // Validación de la fecha
        const fechaActual = new Date();
        fechaActual.setHours(0, 0, 0, 0); // Establece la hora, minutos, segundos y milisegundos a cero
        const seleccionadaFecha = new Date(`${formDataLibros.fechaInicio}T00:00:00`);
        seleccionadaFecha.setHours(0, 0, 0, 0); // Establece la hora, minutos, segundos y milisegundos a cero
        if (seleccionadaFecha < fechaActual) {
            toast.error("La fecha de inicio debe ser mayor o igual a la fecha actual", {
                position: toast.POSITION.BOTTOM_RIGHT,
                autoClose: 3000,
            });
            return;
        }
        const fechafFin = new Date(formDataLibros.fechaFin + 'T00:00:00');
        if (fechafFin < seleccionadaFecha) {
            toast.error("La fecha de fin debe ser mayor o igual a la fecha inicio", {
                position: toast.POSITION.BOTTOM_RIGHT,
                autoClose: 3000,
            });
            return;
        }

        const reservaData = {
            /* title: selectedRow.title,
            year: selectedRow.year,
            category: selectedRow.category,
            'author(s)': selectedRow['author(s)'],
            language: selectedRow.language, */

            userId: userId, // Reemplaza esto con el ID del usuario actual obtenido de tu autenticación
            bookId: selectedRow._id, // Asegúrate de tener el ID correcto del libro seleccionado
            type: 'book', // Esto está basado en el enum en ReservationBook.js
            //verificationCode: generateRandomAlphaNumeric(8),
            reservationDate: new Date(formDataLibros.fechaInicio), // Utiliza la fecha de inicio proporcionada
            returnDate: new Date(formDataLibros.fechaFin),
            duration: new Date(),
            state: 'PENDIENTE',
        };

        try {
            // Realizar la solicitud POST a la API para crear la reserva
            const response = await fetch(`${import.meta.env.VITE_REACT_APP_API_KEY}/api/students/reservations/books`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(reservaData),
            });

            if (!response.ok) {
                throw new Error('Error al reservar el libro');
            }

            toast.success("¡Libro reservado con éxito!", {
                position: toast.POSITION.BOTTOM_RIGHT,
                autoClose: 1000,
            });

            setTimeout(() => {
                limpiarFormularioLibros();
                setSelectedRow(null);
            }, 1000);

            console.log('Reserva exitosa:', reservaData);
        } catch (error) {
            console.error('Error al reservar el libro:', error);
            toast.error('Error al reservar el libro toast', {
                position: toast.POSITION.BOTTOM_RIGHT,
                autoClose: 3000,
            });
        }
    };

    // Efecto para cargar libros desde el backend
    useEffect(() => {
        const fetchLibros = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_REACT_APP_API_KEY}/api/students/view-equipments/books`);
                const data = await response.json();
                const filteredLibros = data.filter((libro) => libro.amount > 0);
                setLibros(filteredLibros);
            } catch (error) {
                console.error("Error fetching libros:", error);
            }
        };
        fetchLibros();
    }, []);

    const normalizeString = (str) => {
        return str
            ? str
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
                .toLowerCase()
            : "";
    };

    const handleSearchLibros = (value) => {
        const normalizedSearchTerm = normalizeString(value);
        const filteredResults = libros.filter((libro) => {
            const normalizedTitle = normalizeString(libro.title);
            const normalizedCategory = normalizeString(libro.category);
            const normalizedLanguage = normalizeString(libro.language);

            const isLanguageSearch = ['es', 'en'].includes(normalizedSearchTerm);

            if (isLanguageSearch) {
                return normalizedLanguage.includes(normalizedSearchTerm);
            } else {
                return (
                    (libro.title && normalizedTitle.includes(normalizedSearchTerm)) ||
                    (libro.category && normalizedCategory.includes(normalizedSearchTerm)) ||
                    (libro.language && normalizedLanguage.includes(normalizedSearchTerm))
                );
            }
        });

        setSearchTermLibros(value);
        setSearchResultsLibros(filteredResults);

        const newItemsPerPage = filteredResults.length > 0 ? Math.max(filteredResults.length, 10) : 10;

        // Ajustar itemsPerPage dependiendo de la cantidad de resultados
        setItemsPerPage(Math.min(newItemsPerPage, 10)); //coincidencias devidido en paginas

        // Resetear la página actual al realizar una búsqueda
        setCurrentPage(0);
    };


    const librosToDisplay = searchResultsLibros.length > 0 ? searchResultsLibros : libros;
    const start = currentPage * itemsPerPage;
    const end = Math.min(start + itemsPerPage, librosToDisplay.length);
    const librosToDisplayPaginated = librosToDisplay.slice(start, end);

    return (
        <>
            <form onSubmit={handleSubmitLibros} className="grid grid-cols-2 gap-1">
                <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg" style={{ maxWidth: '900px' }}>
                    <h2 className="text-center text-2xl font-bold text-gray-800 mb-2">Libros Disponibles</h2>
                    <div>
                        <input
                            type="text"
                            placeholder="Buscar por nombre del Libro, categoría o lenguaje español o ingles(ES o EN)"
                            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300 mb-4"
                            value={searchTermLibros}
                            onChange={(e) => handleSearchLibros(e.target.value)}
                        />
                    </div>
                    <div className="overflow-x-auto">
                        <div className="flex justify-center">
                            <ReactPaginate
                                previousLabel={<span className="px-2 py-1 rounded border border-gray-300 bg-white">Anterior</span>}
                                nextLabel={<span className="px-2 py-1 rounded border border-gray-300 bg-white">Siguiente</span>}
                                breakLabel={<span className="px-2 py-1 rounded border border-gray-300 bg-white">...</span>}
                                pageCount={Math.ceil(librosToDisplay.length / itemsPerPage)}
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
                        <table className="w-full table-auto" style={{ width: '100%', border: '1px solid #000' }}>
                            <thead>
                                <tr>
                                    <th className="px-6 py-3 bg-blue-500 text-white text-left">Seleccionar</th>
                                    <th className="px-6 py-3 bg-blue-500 text-white text-left" style={{ display: 'none' }}>Id</th>
                                    <th className="px-6 py-3 bg-blue-500 text-white text-left">Titulo</th>
                                    <th className="px-6 py-3 bg-blue-500 text-white text-left">Año</th>
                                    <th className="px-6 py-3 bg-blue-500 text-white text-left">Categoria</th>
                                    <th className="px-6 py-3 bg-blue-500 text-white text-left">Autores</th>
                                    <th className="px-6 py-3 bg-blue-500 text-white text-left">Lenguaje</th>
                                </tr>
                            </thead>
                            <tbody>
                                {librosToDisplayPaginated.map((libro, index) => (
                                    <tr key={index}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <input
                                                type="checkbox"
                                                onChange={() => handleRowSelection(libro)}
                                                checked={selectedRow === libro}
                                                className={`${styles.form_checkbox} h-5 w-5 text-blue-500`}
                                            />
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap" style={{ display: 'none' }}>{libro._id}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{libro.title}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{libro.year}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{libro.category}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{libro['author(s)']}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{libro.language}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                </div>

                <div className={`${styles.card} max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg`}>
                    <h2 className="text-center text-2xl font-bold text-gray-800 mb-2">Reservar Libro</h2>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="fechaInicio">
                            Fecha de Inicio:
                        </label>
                        <input
                            type="date"
                            id="fechaInicio"
                            name="fechaInicio"
                            value={formDataLibros.fechaInicio ?? ''}
                            onChange={handleChangeLibros}
                            className="w-full p-2 border border-gray-300 rounded"
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="fechaFin">
                            Fecha de Fin:
                        </label>
                        <input
                            type="date"
                            id="fechaFin"
                            name="fechaFin"
                            value={formDataLibros.fechaFin ?? ''}
                            onChange={handleChangeLibros}
                            className="w-full p-2 border border-gray-300 rounded"
                        />
                    </div>
                    <div className="text-center">
                        <button
                            type="submit"
                            className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                        >
                            Reservar
                        </button>
                    </div>
                    <div className='max-w-4xl mx-auto mt-10'>
                        Encargado(a) de la semana <p className='text-2xl font-bold text-orange-300'>Piero </p>
                        <div className='overflow-x-auto'>
                            <table className='min-w-full bg-white border border-gray-300 mt-5'>
                                <thead>
                                    <tr>
                                        <th class="py-2 px-4 border-b">---</th>

                                        <th class="py-2 px-4 border-b">Lunes</th>
                                        <th class="py-2 px-4 border-b">Martes</th>
                                        <th class="py-2 px-4 border-b">Miércoles</th>
                                        <th class="py-2 px-4 border-b">Jueves</th>
                                        <th class="py-2 px-4 border-b">Viernes</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <td class="py-2 px-4 border-b">Hora</td>
                                    <td class="py-2 px-4 border-b">8:00 - 17:00</td>
                                    <td class="py-2 px-4 border-b">8:00 - 17:00</td>
                                    <td class="py-2 px-4 border-b">8:00 - 17:00</td>
                                    <td class="py-2 px-4 border-b">8:00 - 17:00</td>
                                    <td class="py-2 px-4 border-b">8:00 - 17:00</td>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </form>
        </>
    );
};

export default VerLibros;
