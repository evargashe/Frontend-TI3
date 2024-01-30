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
                            <img src={Calendar} alt="Ver Equipos Solicitados" className={styles.styleImg}/>
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