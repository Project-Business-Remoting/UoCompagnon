import { useEffect, useRef } from "react";
import { io } from "socket.io-client";

/**
 * Custom hook that connects to the Socket.IO server and listens for real-time events.
 * @param {Function} onNotification - Callback when a new notification arrives.
 * @param {Function} onQuestion - Callback when a new question arrives (admin only).
 */
const useSocket = ({ onNotification, onQuestion } = {}) => {
  const socketRef = useRef(null);

  const callbacksRef = useRef({ onNotification, onQuestion });

  useEffect(() => {
    callbacksRef.current = { onNotification, onQuestion };
  }, [onNotification, onQuestion]);

  useEffect(() => {
    const socket = io(window.location.origin, {
      withCredentials: true,
      transports: ["websocket", "polling"],
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("[Socket.IO] Connected:", socket.id);
    });

    socket.on("new-notification", (data) => {
      console.log("[Socket.IO] New notification:", data);
      if (callbacksRef.current.onNotification) callbacksRef.current.onNotification(data);
    });

    socket.on("new-question", (data) => {
      console.log("[Socket.IO] New question:", data);
      if (callbacksRef.current.onQuestion) callbacksRef.current.onQuestion(data);
    });

    socket.on("connect_error", (err) => {
      console.warn("[Socket.IO] Connection error:", err.message);
    });

    return () => {
      socket.disconnect();
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return socketRef;
};

export default useSocket;
