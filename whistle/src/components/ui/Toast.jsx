import React, { useState, useEffect, useCallback, createContext, useContext } from "react";
import { CheckCircle2, X, AlertCircle, Info } from "lucide-react";

const ToastContext = createContext();

const iconMap = {
  success: CheckCircle2,
  error: AlertCircle,
  info: Info,
};

const colorMap = {
  success: "var(--color-success)",
  error: "var(--color-error)",
  info: "var(--color-info)",
};

function ToastItem({ toast, onDismiss }) {
  const [exiting, setExiting] = useState(false);
  const Icon = iconMap[toast.type] || CheckCircle2;
  const color = colorMap[toast.type] || colorMap.success;

  useEffect(() => {
    const timer = setTimeout(() => {
      setExiting(true);
      setTimeout(() => onDismiss(toast.id), 200);
    }, toast.duration || 3000);
    return () => clearTimeout(timer);
  }, [toast, onDismiss]);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "14px 18px",
        background: "var(--color-surface-raised)",
        border: "1px solid var(--color-border)",
        borderRadius: "var(--radius-lg)",
        boxShadow: "var(--shadow-lg)",
        animation: exiting ? "fadeInDown 0.2s ease-out reverse forwards" : "fadeInUp 0.3s ease-out",
        minWidth: 280,
        maxWidth: 400,
      }}
    >
      <Icon size={18} color={color} style={{ flexShrink: 0 }} />
      <span style={{ flex: 1, fontSize: "var(--text-sm)", fontWeight: "var(--weight-medium)", color: "var(--color-text-primary)" }}>
        {toast.message}
      </span>
      <button
        onClick={() => { setExiting(true); setTimeout(() => onDismiss(toast.id), 200); }}
        style={{ padding: 4, border: "none", background: "transparent", cursor: "pointer", color: "var(--color-text-faint)", display: "flex" }}
        aria-label="Dismiss notification"
      >
        <X size={14} />
      </button>
    </div>
  );
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = "success", duration = 3000) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type, duration }]);
  }, []);

  const dismissToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={addToast}>
      {children}
      {toasts.length > 0 && (
        <div
          style={{
            position: "fixed",
            bottom: 24,
            right: 24,
            zIndex: 1100,
            display: "flex",
            flexDirection: "column-reverse",
            gap: 8,
          }}
          aria-live="polite"
          aria-label="Notifications"
        >
          {toasts.map((toast) => (
            <ToastItem key={toast.id} toast={toast} onDismiss={dismissToast} />
          ))}
        </div>
      )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}
