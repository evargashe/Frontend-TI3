import React, { useState, useEffect } from 'react';

const WeekRangeComponent = () => {
  const [weekRange, setWeekRange] = useState('');

  useEffect(() => {
    const today = new Date();
    const firstDayOfWeek = new Date(today);
    const lastDayOfWeek = new Date(today);

    const currentDayOfWeek = today.getDay();
    firstDayOfWeek.setDate(today.getDate() - currentDayOfWeek + 1);
    lastDayOfWeek.setDate(today.getDate() + (7 - currentDayOfWeek));

    const startDate = `${firstDayOfWeek.getDate()}/${firstDayOfWeek.getMonth() + 1}/${today.getFullYear()}`;
    const endDate = `${lastDayOfWeek.getDate()}/${lastDayOfWeek.getMonth() + 1}/${today.getFullYear()}`;

    setWeekRange(`${startDate} al ${endDate}`);
  }, []);

  return <> <p className='text-3xl font-bold'>Del {weekRange}</p> </>;
};

export default WeekRangeComponent;
