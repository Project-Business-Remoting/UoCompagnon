import { useEffect, useState } from "react";
import { Bell, X } from "lucide-react";
import "./Toast.css";

// Simple notification sound (short beep using Web Audio API)
const playNotifSound = () => {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();

    oscillator.connect(gain);
    gain.connect(ctx.destination);

    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(880, ctx.currentTime); // A5
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.5);
  } catch {
    // Silently fail if AudioContext is not available
  }
};

const Toast = ({ toasts, onDismiss }) => {
  return (
    <div className="toast-container" role="alert" aria-live="polite">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
};

const ToastItem = ({ toast, onDismiss }) => {
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setExiting(true);
      setTimeout(() => onDismiss(toast.id), 300);
    }, 5000);

    return () => clearTimeout(timer);
  }, [toast.id, onDismiss]);

  const handleClick = (e) => {
    // Ne pas déclencher si on clique sur le bouton de fermeture
    if (e.target.closest('.toast-close')) return;
    
    if (toast.onClick) {
      toast.onClick();
      setExiting(true);
      setTimeout(() => onDismiss(toast.id), 300);
    }
  };

  return (
    <div 
      className={`toast-item toast-item--${toast.type || "info"} ${exiting ? "toast-item--exit" : ""} ${toast.onClick ? "toast-item--clickable" : ""}`}
      onClick={handleClick}
    >
      <div className="toast-icon">
        <Bell size={16} />
      </div>
      <div className="toast-body">
        <span className="toast-title">{toast.title}</span>
        <span className="toast-message">{toast.message}</span>
      </div>
      <button
        className="toast-close"
        onClick={() => {
          setExiting(true);
          setTimeout(() => onDismiss(toast.id), 300);
        }}
        aria-label="Dismiss notification"
      >
        <X size={14} />
      </button>
    </div>
  );
};

export { Toast, playNotifSound };
