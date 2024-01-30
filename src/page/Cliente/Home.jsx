import React from 'react';
import Logo from '../../assets/ESCUELA-TELECOMUNICACIONES-UNSA-878x426.jpg'
import { Link } from 'react-router-dom';

import Calendar from 'flat-color-icons/svg/calendar.svg'
import OverTime from 'flat-color-icons/svg/overtime.svg'
import MultipleSmarphones from 'flat-color-icons/svg/multiple_smartphones.svg'

import styles from './styles/Home.module.css';

function Home(props) {
    return (
        <div className={styles.containerStyles}>
            <div>
                <img src={Logo} alt="logo" className={styles.imageStyles} />
            </div>
            <div className={styles.infoContainerStyles}>
                <div className={styles.styleInfo}>
                    <a className="btn">
                        <Link to="/client/horario">
                            <p>Ver Horarios</p>
                            <img src={Calendar} alt="ver Horarios" className={styles.styleImg}/>
                        </Link>
                    </a>
                </div>
                <div className={styles.styleInfo}>
                    <a className="btn">
                        <Link to="/client/reservar">
                            <p>Reservar Equipos</p>
                            <img src={OverTime} alt="Reservar Equipos" className={styles.styleImg}/>
                        </Link>
                    </a>
                </div>
                <div className={styles.styleInfo}>
                    <a className="btn">
                        <Link to="/client/ver-equipos">
                            <p>Ver equipos</p>
                            <img src={MultipleSmarphones} alt="Ver equipos" className={styles.styleImg}/>
                        </Link>
                    </a>
                </div>
            </div>
        </div>
    );
}

export default Home;
