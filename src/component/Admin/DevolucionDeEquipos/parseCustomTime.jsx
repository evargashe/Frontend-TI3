const parseCustomTime = (timeString) => {
    const options = { hour: '2-digit', minute: '2-digit' };
    const time = new Date(`2000-01-01T${timeString}`);
    return time.toLocaleTimeString(undefined, options);
};

export default parseCustomTime;