"use client";

import { useEffect, useState } from "react";
import { Alert, Snackbar } from "@mui/material";
import { subscribeToast, type ToastPayload } from "@/lib/toast";

export function Toaster() {
  const [toast, setToast] = useState<ToastPayload | null>(null);

  useEffect(() => subscribeToast(setToast), []);

  return (
    <Snackbar
      open={toast !== null}
      autoHideDuration={3000}
      onClose={() => setToast(null)}
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
    >
      <Alert severity={toast?.severity ?? "success"} onClose={() => setToast(null)}>
        {toast?.message}
      </Alert>
    </Snackbar>
  );
}
