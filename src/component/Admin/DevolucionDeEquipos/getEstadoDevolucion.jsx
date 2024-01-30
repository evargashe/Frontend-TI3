import { format, isValid, isAfter, parseISO, addDays, startOfDay, addHours, addMinutes, isEqual } from "date-fns";
import parseCustomTime from "./parseCustomTime";

const getEstadoDevolucion = (item) => {
    const fechaActual = new Date();

    if (item.type === 'book') {
        const returnDate = parseISO(item.returnDate);
        const endOfDayReturnDate = addDays(startOfDay(returnDate), 1); // Asegurarse de comparar hasta el final del día
        return isValid(returnDate) && (isAfter(endOfDayReturnDate, fechaActual) ||
            format(endOfDayReturnDate, 'yyyy-MM-dd') === format(fechaActual, 'yyyy-MM-dd')) ? 'EN PLAZO' : 'PLAZO VENCIDO';
    } else if (item.type === 'equipment') {
        const reservationDateTime = parseISO(item.reservationDateTime);
        const endOfDayReturnDate = addDays(startOfDay(reservationDateTime), 1); // Asegurarse de comparar hasta el final del día

        if (isAfter(fechaActual, endOfDayReturnDate) || fechaActual >= endOfDayReturnDate) {
            const [endHourStr, endMinuteStr] = item.endHour.split(":");
            const endHour = parseInt(endHourStr, 10);
            const endMinute = parseInt(endMinuteStr, 10) || 0; // Si item.endMinute no está definido, asumir 0 minutos
            const endDateTime = addMinutes(addHours(endOfDayReturnDate, endHour), endMinute);
            
            // Comparamos la fecha y hora actual con la fecha y hora de finalización
            if (isAfter(fechaActual, endDateTime) || isEqual(fechaActual, endDateTime)) {
                return 'PLAZO VENCIDO';
            } else {
                return 'EN PLAZO';
            }
        } else {
            return 'EN PLAZO';

        }
    }
    return 'EN PLAZO';
};

export default getEstadoDevolucion;
