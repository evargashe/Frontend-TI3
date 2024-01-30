import React, { createContext, useContext, useState } from 'react';

const UserContext = createContext();

export const AdminProvider = ({ children }) => {
  const [adminId, setAdminId] = useState(() => {
    // Inicializa userId con el valor almacenado en localStorage
    return localStorage.getItem('adminId') || null;
  });  //  const [userId, setUserId] = useState(null);
  
  const value = {
    adminId,
    setAdminId,
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useAdmin debe ser utilizado dentro de un UserProvider');
  }
  return context;
};
