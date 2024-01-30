import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import moment from 'moment';
import 'moment/locale/es';
import styles from '../../../page/Cliente/styles/HomeHorario.module.css';
import axios from 'axios';

const formatDateForTable = (dateString, isEnd) => {
    const date = new Date(dateString);

    const timeZoneOffset = -5; // Ajustar según la zona horaria necesaria

    // Agregar ceros a la izquierda para asegurar dos dígitos
    const pad = (number) => (number < 10 ? '0' : '') + number;

    const offsetSign = timeZoneOffset >= 0 ? '+' : '-';

    // Establecer la hora en 00:00:01 para el evento de inicio
    const formattedDate = date.toISOString().replace(/(\d{4}-\d{2}-\d{2})T(\d{2}:\d{2}:\d{2}).*/, `$1T${isEnd ? '23:59:59' : '00:00:01'}${offsetSign}${pad(Math.abs(timeZoneOffset))}:00`);

    return formattedDate;
};

const VerLibros = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [allEvents, setAllEvents] = useState([]);
    const [filteredEvents, setFilteredEvents] = useState([]);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                // Llamar al endpoint para obtener reservas aceptadas
                const response = await axios.get('http://localhost:4000/api/students/accepted-reservations/books');

                const formattedData = await Promise.all(response.data.map(async (event) => {
                    // Obtener detalles del libro utilizando el nuevo endpoint
                    const bookDetailsResponse = await axios.get(`http://localhost:4000/api/students/getDetailsItem/books/${event.bookId}`);
                    const bookDetails = bookDetailsResponse.data;

                    const startMoment = moment(event.reservationDate);
                    const endMoment = moment(event.returnDate);

                    // Establecer la hora en 23:59:59 para el evento de fin
                    endMoment.set({ hour: 23, minute: 59, second: 59 });

                    return {
                        title: bookDetails.title, // Utilizar el nombre del libro como título
                        start: formatDateForTable(startMoment.format(), false), // Para el comienzo del evento
                        end: formatDateForTable(endMoment.format(), true), // Para el fin del evento
                    };
                }));

                const resolvedData = await Promise.all(formattedData);
                setAllEvents(resolvedData);
                setFilteredEvents(resolvedData);
            } catch (error) {
                console.error('Error al obtener reservas aceptadas:', error);
            }
        };

        fetchEvents();
    }, []);

    useEffect(() => {
        // Filtrar eventos basados en el término de búsqueda
        const filtered = allEvents.filter(event => event.title.toLowerCase().includes(searchTerm.toLowerCase()));
        setFilteredEvents(filtered);
    }, [searchTerm, allEvents]);

    return (
        <div className={`max-w-screen-md mx-auto p-2 bg-white rounded-lg shadow-lg ${styles.containerStyles}`}>
            <h2 className="text-center text-2xl font-bold text-gray-800">Libros</h2>

            <div className={`hero ${styles.hero}`}>
                <div className={`calendar ${styles.calendarContainer}`}>
                    <input
                        type="text"
                        placeholder="Buscar por título"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ width: '100%' }}
                        className="text text-center w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
                    />

                    <FullCalendar
                        plugins={[dayGridPlugin, timeGridPlugin]}
                        initialView="timeGridWeek"
                        headerToolbar={{
                            left: 'prev,next today',
                            center: 'title',
                            right: 'dayGridMonth,timeGridWeek',
                        }}
                        events={filteredEvents}
                        slotLabelFormat={{
                            hour: 'numeric',
                            minute: '2-digit',
                            omitZeroMinute: false,
                            meridiem: 'short',
                            hour12: true,
                        }}
                    />
                </div>
            </div>
        </div>
    );
}

export default VerLibros;
