import { format, isValid, isAfter, parseISO, addDays, startOfDay, addHours, addMinutes, isEqual } from "date-fns";

const getEstadoDevolucion = (item, actual) => {
    const fechaActual = new Date(actual);
    if (item.itemType === 'Book') {
        const returnDate = parseISO(item.returnDate);
        const endOfDayReturnDate = addDays(startOfDay(returnDate), 1); // Asegurarse de comparar hasta el final del día
        return isValid(returnDate) && (isAfter(endOfDayReturnDate, fechaActual) ||
            format(endOfDayReturnDate, 'yyyy-MM-dd') === format(fechaActual, 'yyyy-MM-dd')) ? 'ENTREGA A TIEMPO' : 'ENTREGA CON RETRASO';
    } else if (item.itemType === 'Equipment') {
        const reservationDateTime = parseISO(item.returnDate);
        const endOfDayReturnDate = addDays(startOfDay(reservationDateTime), 1); // Asegurarse de comparar hasta el final del día
        if (isAfter(fechaActual, endOfDayReturnDate) || fechaActual > endOfDayReturnDate) {
            const [endHourStr, endMinuteStr] = item.endHour.split(":");
            const endHour = parseInt(endHourStr, 10);
            const endMinute = parseInt(endMinuteStr, 10) || 0; // Si item.endMinute no está definido, asumir 0 minutos
            const endDateTime = addMinutes(addHours(endOfDayReturnDate, endHour), endMinute);
            // Comparamos la fecha y hora actual con la fecha y hora de finalización
            if (isAfter(fechaActual, endDateTime)) {
                return 'ENTREGA CON RETRASO';
            } else {
                return 'ENTREGA A TIEMPO';
            }
        } else {
            return 'ENTREGA A TIEMPO';

        }
    }
    return 'ENTREGA A TIEMPO';
};

export default getEstadoDevolucion;
