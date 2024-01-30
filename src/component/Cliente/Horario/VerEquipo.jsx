import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import moment from 'moment';
import 'moment/locale/es';
import styles from '../../../page/Cliente/styles/HomeHorario.module.css';
import axios from 'axios';

const formatDateForTable = (dateString, startHour, endHour, isEnd) => {
    const date = new Date(dateString);

    const timeZoneOffset = -5; // Ajustar según la zona horaria necesaria

    // Agregar ceros a la izquierda para asegurar dos dígitos
    const pad = (number) => (number < 10 ? '0' : '') + number;

    const offsetSign = timeZoneOffset >= 0 ? '+' : '-';


    const formattedDate = date.toISOString().replace(/(\d{4}-\d{2}-\d{2})T(\d{2}:\d{2}:\d{2}).*/, `$1T${isEnd ? endHour + ':00' : startHour + ':00'}${offsetSign}${pad(Math.abs(timeZoneOffset))}:00`);

    return formattedDate;
};


const VerEquipos = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [allEvents, setAllEvents] = useState([]);
    const [filteredEvents, setFilteredEvents] = useState([]);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await axios.get('http://localhost:4000/api/students/accepted-reservations/equipments');

                const formattedData = await Promise.all(response.data.map(async (event) => {
                    const equipmentDetailsResponse = await axios.get(`http://localhost:4000/api/students/getDetailsItem/equipments/${event.equipmentId}`);
                    const equipmentDetails = equipmentDetailsResponse.data;

                    const startMoment = moment(event.reservationDateTime);
                    const endMoment = moment(event.reservationDateTime);

                    return {
                        title: equipmentDetails.name,
                        start: formatDateForTable(startMoment.format(), event.startHour, event.endHour, false),
                        end: formatDateForTable(endMoment.format(), event.startHour, event.endHour, true),
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
            <h2 className="text-center text-2xl font-bold text-gray-800">Equipos</h2>

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
                            right: 'dayGridMonth,timeGridWeek,timeGridDay',
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

export default VerEquipos;
