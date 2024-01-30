import React from 'react';
import { Link } from 'react-router-dom';
import styles from '../../../page/Cliente//styles/HomeHorario.module.css';
const MostraBotones = () => (
    <div className={`buttons ${styles.infoContainerStyles}`}>
        <Link to="/client/reservar">
            <button className={`btn ${styles.customButton}`}>Reservar Horario</button>
        </Link>
        <Link to="/client/ver-equipos">
            <button className={`btn ${styles.customButton}`}>Ver Equipos</button>
        </Link>
    </div>
);

export default MostraBotones;
