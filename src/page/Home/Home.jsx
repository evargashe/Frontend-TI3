import React from 'react';
import Logo from '../../assets/ESCUELA-TELECOMUNICACIONES-UNSA-878x426.jpg';
import styles from './styles/Home.module.css';

function Home(props) {
    return (
        <div className={styles.container}>
            <div className={styles.imageContainer}>
                <img src={Logo} alt="logo" className={styles.image} />
                <div className={styles.overlayContainer}>
                    <div className={styles.overlayText}>
                        Sistema de Gestión de Inventario de la
                        <br />
                        Escuela Profesional Ciencia de la Computación
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Home;
