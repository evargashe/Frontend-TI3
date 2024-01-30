const obtenerUserIdDesdeServidor = async (token) => {
    try {
        const response = await fetch(`${import.meta.env.VITE_REACT_APP_API_KEY}/api/students/get-user-id`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (response.ok) {
            const data = await response.json();
            console.log('UserId obtenido desde el servidor:', data.userId);
            return data.userId;
        } else {
            console.error('Error al obtener el userId desde el servidor:', response.statusText);
            throw new Error('Error al obtener el userId desde el servidor');
        }
    } catch (error) {
        console.error('Error al obtener el userId desde el servidor:', error);
        throw new Error('Error al obtener el userId desde el servidor');
    }
};

export default obtenerUserIdDesdeServidor;