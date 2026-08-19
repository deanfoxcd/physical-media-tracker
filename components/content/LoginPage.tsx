"use client";

import { useState } from "react";
import { Alert, Stack, TextField, Typography } from "@mui/material";
import { useForm } from "react-hook-form";
import { ActionButton } from "../blocks/ActionButton";
import { useAuth } from "@/contexts/AuthContext";
import { PASSWORD_REGEX } from "@/constants/passwordRegex";
import Head from "next/head";
import { Header } from "../blocks/Header";

interface LoginFormValues {
  email: string;
  password: string;
}

function getAuthErrorMessage(error: unknown): string {
  if (error && typeof error === "object" && "code" in error) {
    switch (error.code) {
      case "auth/invalid-email":
        return "Please enter a valid email address.";
      case "auth/email-already-in-use":
        return "An account with this email already exists.";
      case "auth/weak-password":
        return "Password is too weak.";
      case "auth/invalid-credential":
      case "auth/wrong-password":
      case "auth/user-not-found":
        return "Invalid email or password.";
      default:
        return "Something went wrong. Please try again.";
    }
  }
  return "Something went wrong. Please try again.";
}

export const LoginPage = () => {
  const { login, signUp } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    defaultValues: { email: "", password: "" },
  });
  const [error, setError] = useState<string | null>(null);

  async function onLogin(values: LoginFormValues) {
    setError(null);
    try {
      await login(values.email, values.password);
    } catch (err) {
      setError(getAuthErrorMessage(err));
    }
  }

  async function onSignUp(values: LoginFormValues) {
    setError(null);
    if (!PASSWORD_REGEX.test(values.password)) {
      setError(
        "Password must be at least 8 characters and include an uppercase letter and a symbol.",
      );
      return;
    }
    try {
      await signUp(values.email, values.password);
    } catch (err) {
      setError(getAuthErrorMessage(err));
    }
  }

  return (
    <>
      <Header />
      <Stack
        component="form"
        spacing={3}
        onSubmit={handleSubmit(onLogin)}
        sx={{ alignItems: "center", pt: 10 }}
      >
        <Typography variant="h3">Login or Sign Up</Typography>
        {error && <Alert severity="error">{error}</Alert>}
        <Stack spacing={2}>
          <TextField
            label="Email"
            type="email"
            required
            {...register("email")}
          />
          <TextField
            label="Password"
            type="password"
            required
            {...register("password")}
          />
          <Stack direction="row" spacing={2}>
            <ActionButton type="submit">Login</ActionButton>
            <ActionButton type="button" minor onClick={handleSubmit(onSignUp)}>
              Sign Up
            </ActionButton>
          </Stack>
        </Stack>
      </Stack>
    </>
  );
};
