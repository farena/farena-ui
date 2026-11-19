import {
  createContext,
  useContext,
  useEffect,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import "./_toast.scss";

export type ToastType = "success" | "error" | "warning" | "info";
export type ToastApi = Record<ToastType, (message: string) => void>;
type ToastItem = { id: number; type: ToastType; message: string };
type Snapshot = { items: ToastItem[]; host: symbol | null };

let nextId = 0;
let snapshot: Snapshot = { items: [], host: null };
const listeners = new Set<() => void>();
const providers = new Set<symbol>();
const timers = new Map<number, ReturnType<typeof setTimeout>>();
const emit = (next: Snapshot) => {
  snapshot = next;
  listeners.forEach((listener) => listener());
};
const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};
const getSnapshot = () => snapshot;
const remove = (id: number) => {
  clearTimeout(timers.get(id));
  timers.delete(id);
  emit({ ...snapshot, items: snapshot.items.filter((item) => item.id !== id) });
};
const show = (type: ToastType, message: string) => {
  if (!providers.size) return;
  const id = ++nextId;
  emit({ ...snapshot, items: [...snapshot.items, { id, type, message }] });
  timers.set(
    id,
    setTimeout(() => remove(id), 5000),
  );
};

// Shared by imperative callers and every provider context. The first mounted provider is the visual host.
export const toast: ToastApi = {
  success: (message) => show("success", message),
  error: (message) => show("error", message),
  warning: (message) => show("warning", message),
  info: (message) => show("info", message),
};
const ToastContext = createContext<ToastApi | null>(null);
export function useToast(): ToastApi {
  const api = useContext(ToastContext);
  if (!api) throw new Error("useToast must be used inside a ToastProvider");
  return api;
}

export default function ToastProvider({ children }: { children: ReactNode }) {
  const [id] = useState(() => Symbol("toast-provider"));
  const state = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
  useEffect(() => {
    providers.add(id);
    if (snapshot.host === null) emit({ ...snapshot, host: id });
    return () => {
      providers.delete(id);
      if (!providers.size) {
        timers.forEach((timer) => clearTimeout(timer));
        timers.clear();
        emit({ items: [], host: null });
      } else if (snapshot.host === id) {
        emit({ ...snapshot, host: providers.values().next().value ?? null });
      }
    };
  }, [id]);
  return (
    <ToastContext.Provider value={toast}>
      {children}
      {state.host === id && (
        <div className="toast-container" role="region" aria-label="Notifications">
          {state.items.map((item) => (
            <div
              key={item.id}
              className={`toast-item toast-${item.type}`}
              role={item.type === "error" ? "alert" : "status"}
            >
              <span className="toast-message">{item.message}</span>
              <button
                type="button"
                className="toast-close"
                aria-label={`Dismiss ${item.type} notification`}
                onClick={() => remove(item.id)}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </ToastContext.Provider>
  );
}
