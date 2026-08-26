export type ToastSeverity = "success" | "error";

export interface ToastPayload {
  message: string;
  severity: ToastSeverity;
}

type ToastListener = (payload: ToastPayload) => void;

let listener: ToastListener | null = null;

export function subscribeToast(fn: ToastListener) {
  listener = fn;
  return () => {
    if (listener === fn) listener = null;
  };
}

export function showToast(message: string, severity: ToastSeverity = "success") {
  listener?.({ message, severity });
}
