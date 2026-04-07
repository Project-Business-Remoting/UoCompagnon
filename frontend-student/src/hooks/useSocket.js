import { useEffect, useRef } from "react";
import { io } from "socket.io-client";

/**
 * Custom hook that connects to the Socket.IO server and listens for real-time events.
 * @param {Function} onNotification 
 * @param {Function} onQuestion 
 * @param {Function} onQuestionReplied 
 * @param {Function} onPhotoStatusUpdated
 */
const useSocket = ({ onNotification, onQuestion, onQuestionReplied, onPhotoStatusUpdated } = {}) => {
  const socketRef = useRef(null);

  const callbacksRef = useRef({ onNotification, onQuestion, onQuestionReplied, onPhotoStatusUpdated });

  useEffect(() => {
    callbacksRef.current = { onNotification, onQuestion, onQuestionReplied, onPhotoStatusUpdated };
  }, [onNotification, onQuestion, onQuestionReplied, onPhotoStatusUpdated]);

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

    socket.on("question-replied", (data) => {
      console.log("[Socket.IO] Question replied:", data);
      if (callbacksRef.current.onQuestionReplied) callbacksRef.current.onQuestionReplied(data);
    });

    socket.on("photo-status-updated", (data) => {
      console.log("[Socket.IO] Photo status updated:", data);
      if (callbacksRef.current.onPhotoStatusUpdated) callbacksRef.current.onPhotoStatusUpdated(data);
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
