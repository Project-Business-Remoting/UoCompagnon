import { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const { user } = useAuth();
  const [socket, setSocket] = useState(null);
  const [lastMessage, setLastMessage] = useState(null);
  const [lastNotification, setLastNotification] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Si pas de user connecté (ou pas de token), pas de socket
    if (!user || !user.token) {
      // Disconnect existing socket if user logs out
      if (socket) {
        socket.disconnect();
        setSocket(null);
        setIsConnected(false);
      }
      return;
    }

    // Socket.IO must connect to server root, not /api
    const rawUrl = import.meta.env.VITE_SOCKET_URL || import.meta.env.VITE_API_URL || window.location.origin;
    const socketUrl = rawUrl.replace(/\/api\/?$/, "");
    console.log("[Socket.IO] Admin attempting connection to:", socketUrl);

    // Initialisation
    const newSocket = io(socketUrl, {
      auth: { token: user.token },
      withCredentials: true,
      transports: ['websocket', 'polling'],
    });

    setSocket(newSocket);

    // Écoute des événements standards
    newSocket.on('connect', () => {
      console.log('[Socket.IO] Admin Connected! Socket ID:', newSocket.id);
      setIsConnected(true);
    });

    newSocket.on('disconnect', () => {
      console.log('[Socket.IO] Admin disconnected');
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

    newSocket.on('connect_error', (err) => {
      console.warn('[Socket.IO] Admin connection error:', err.message);
    });

    // Cleanup à la destruction ou changement de user
    return () => {
      console.log("Déconnexion du Socket Global Admin");
      newSocket.off('connect');
      newSocket.off('disconnect');
      newSocket.off('new-question');
      newSocket.off('new-notification');
      newSocket.off('connect_error');
      newSocket.disconnect();
    };
  }, [user]); // Re-run when user changes (login/logout)

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
