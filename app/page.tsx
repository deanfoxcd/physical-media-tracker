"use client";

import { CircularProgress, Stack } from "@mui/material";
import { useAuth } from "@/contexts/AuthContext";
import { LandingPage } from "@/components/content/LandingPage/LandingPage";
import { LoginPage } from "@/components/content/LoginPage/LoginPage";
import { homeSX } from "./styles/home";

export default function Home() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <Stack sx={homeSX}>
        <CircularProgress />
      </Stack>
    );
  }

  return user ? <LandingPage /> : <LoginPage />;
}
