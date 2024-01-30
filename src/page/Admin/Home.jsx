import React from 'react';
import Logo from '../../assets/ESCUELA-TELECOMUNICACIONES-UNSA-878x426.jpg'
import { Link } from 'react-router-dom';
import Calendar from '@vscode/codicons/src/icons/Calendar.svg';
import OverTime from '@tabler/icons/calendar-repeat.svg';
import MultipleSmarphones from '@tabler/icons/file-report.svg'
import styles from './styles/Home.module.css';
import { useAdmin } from '../../context/AdminContext';

function HomeAdmin(props) {
    const { adminId } = useAdmin();
    console.log(adminId);
    return (
        <div className={styles.containerStyles}>
            <div>
                <img src={Logo} alt="logo" className={styles.imageStyles} />
            </div>
            <div className={styles.infoContainerStyles}>
                <div className={styles.stylesInfo}>
                    <a className="btn">
                        <Link to="/admin/equipos-solicitados">
                            <p>Ver Equipos Solicitados</p>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                                <path d="M12.75 12.75a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM7.5 15.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5ZM8.25 17.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM9.75 15.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5ZM10.5 17.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12 15.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5ZM12.75 17.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM14.25 15.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5ZM15 17.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM16.5 15.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5ZM15 12.75a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM16.5 13.5a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z" />
                                <path fillRule="evenodd" d="M6.75 2.25A.75.75 0 0 1 7.5 3v1.5h9V3A.75.75 0 0 1 18 3v1.5h.75a3 3 0 0 1 3 3v11.25a3 3 0 0 1-3 3H5.25a3 3 0 0 1-3-3V7.5a3 3 0 0 1 3-3H6V3a.75.75 0 0 1 .75-.75Zm13.5 9a1.5 1.5 0 0 0-1.5-1.5H5.25a1.5 1.5 0 0 0-1.5 1.5v7.5a1.5 1.5 0 0 0 1.5 1.5h13.5a1.5 1.5 0 0 0 1.5-1.5v-7.5Z" clipRule="evenodd" />
                            </svg>
                        </Link>

                    </a>
                </div>
                <div className={styles.stylesInfo}>
                    <a className="btn">
                        <Link to="/admin/devolucion-equipos">
                            <p>Devolucion Equipos</p>
                            <img src={OverTime} alt="Devolucion Equipos" className={styles.styleImg} />
                        </Link>

                    </a>
                </div>
                <div className={styles.stylesInfo}>
                    <a className="btn">
                        <Link to="/admin/ver-equipos">
                            <p>Ver Equipos</p>
                            <img src={OverTime} alt="Agregar Equipos" className={styles.styleImg} />
                        </Link>

                    </a>
                </div>
                <div className={styles.stylesInfo}>
                    <a className="btn">
                        <Link to="/admin/agregar-equipos">
                            <p>Agregar Equipos</p>
                            <img src={OverTime} alt="Agregar Equipos" className={styles.styleImg} />
                        </Link>

                    </a>
                </div>
                <div className={styles.stylesInfo}>
                    <a className="btn">
                        <Link to="/admin/reportes">
                            <p>Reportes</p>
                            <img src={MultipleSmarphones} alt="Reportes" className={styles.styleImg} />
                        </Link>

                    </a>
                </div>
            </div>

        </div>
    );
}

export default HomeAdmin;