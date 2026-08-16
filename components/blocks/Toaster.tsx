"use client";

import { useEffect, useState } from "react";
import { Alert, Snackbar } from "@mui/material";
import { subscribeToast } from "@/lib/toast";

export function Toaster() {
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => subscribeToast(setMessage), []);

  return (
    <Snackbar
      open={message !== null}
      autoHideDuration={3000}
      onClose={() => setMessage(null)}
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
    >
      <Alert severity="success" onClose={() => setMessage(null)}>
        {message}
      </Alert>
    </Snackbar>
  );
}
