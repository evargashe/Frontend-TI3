export const calculateTimeRemaining = (scheduledTime) => {
    const now = new Date();
    const scheduled = new Date(scheduledTime);
    const difference = scheduled - now;

    if (difference > 0) {
        const minutes = Math.floor(difference / 60000);
        const seconds = Math.floor((difference % 60000) / 1000);
        return `${minutes} min ${seconds} sec`;
    } else {
        return 'Expirado';
    }
};