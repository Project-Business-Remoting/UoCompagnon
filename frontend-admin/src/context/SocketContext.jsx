import { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [lastMessage, setLastMessage] = useState(null);
  const [lastNotification, setLastNotification] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Obtenir le token pour l'authentification (pour que le backend nous identifie comme admin)
    const token = localStorage.getItem('uo_token');
    
    // Si pas de token (user pas connecté), on ne tente pas de se connecter au socket
    if (!token) return;

    const socketUrl = import.meta.env.VITE_SOCKET_URL || window.location.origin;
    console.log("[Socket.IO] Attempting connection to:", socketUrl);
    
    console.log("Initialisation DU SOCKET GLOBALE (1 seule fois)");
    
    // Initialisation
    const newSocket = io(socketUrl, {
      withCredentials: true,
      transports: ['websocket', 'polling'], // Fallback polling si websocket pur échoue
    });

    setSocket(newSocket);

    // Écoute des événements standards
    newSocket.on('connect', () => {
      console.log('[Socket.IO] Admin Connected! Socket ID:', newSocket.id);
      setIsConnected(true);
    });

    newSocket.on('disconnect', () => {
      console.log('Socket global déconnecté !');
      setIsConnected(false);
    });

    // Écoute de l'événement custom 'new-question'
    newSocket.on('new-question', (data) => {
      console.log('Nouvelle question reçue (Global) :', data);
      setLastMessage(data);
    });

    // Écoute de l'événement custom 'new-notification'
    newSocket.on('new-notification', (data) => {
      console.log('Nouvelle notification système :', data);
      setLastNotification(data);
    });

    // Cleanup à la destruction du context
    return () => {
      console.log("Déconnexion du Socket Global");
      newSocket.off('connect');
      newSocket.off('disconnect');
      newSocket.off('new-question');
      newSocket.off('new-notification');
      newSocket.disconnect();
    };
  }, []); // [] = Le socket est initialisé 1 seule fois, au montage de l'application

  return (
    <SocketContext.Provider value={{ socket, lastMessage, setLastMessage, lastNotification, setLastNotification, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};

// Hook personnalisé pour consommer le context
export const useSocketContext = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocketContext must be used within a SocketProvider');
  }
  return context;
};
