"use client";

import { CircularProgress, Stack } from "@mui/material";
import { useAuth } from "@/contexts/AuthContext";
import { LandingPage } from "@/components/content/LandingPage";
import { LoginPage } from "@/components/content/LoginPage";

export default function Home() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <Stack sx={{ alignItems: "center", mt: 10 }}>
        <CircularProgress />
      </Stack>
    );
  }

  return user ? <LandingPage /> : <LoginPage />;
}
