"use client";

import { useState } from "react";
import { Alert, Link, Stack, TextField, Typography } from "@mui/material";
import { useForm } from "react-hook-form";
import { ActionButton } from "../../blocks/ActionButton";
import { useAuth } from "@/contexts/AuthContext";
import { PASSWORD_REGEX } from "@/constants/passwordRegex";
import { Header } from "../../blocks/Header/Header";
import { PaddedPaper } from "../../blocks/PaddedPaper";
import { buttonStackSX, forgotPasswordLinkSX, mainStackSX } from "./styles";

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
      case "auth/missing-email":
        return "Please enter your email address first.";
      default:
        return "Something went wrong. Please try again.";
    }
  }
  return "Something went wrong. Please try again.";
}

export const LoginPage = () => {
  const { login, signUp, resetPassword } = useAuth();
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<LoginFormValues>({
    defaultValues: { email: "", password: "" },
  });
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  async function onLogin(values: LoginFormValues) {
    setError(null);
    setMessage(null);
    try {
      await login(values.email, values.password);
    } catch (err) {
      setError(getAuthErrorMessage(err));
    }
  }

  async function onForgotPassword() {
    setError(null);
    setMessage(null);
    const email = getValues("email");
    if (!email) {
      setError("Please enter your email address first.");
      return;
    }
    try {
      await resetPassword(email);
      setMessage("Password reset email sent. Check your inbox.");
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
    <Stack>
      <Header />
      <Stack
        component="form"
        spacing={5}
        onSubmit={handleSubmit(onLogin)}
        sx={mainStackSX}
      >
        <PaddedPaper>
          <Stack spacing={5}>
            <Typography variant="h3">Login or Sign Up</Typography>
            {error && <Alert severity="error">{error}</Alert>}
            {message && <Alert severity="success">{message}</Alert>}
            <Stack spacing={3}>
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
                <Link
                  component="button"
                  type="button"
                  sx={forgotPasswordLinkSX}
                  onClick={onForgotPassword}
                >
                  Forgot password?
                </Link>
              </Stack>

              <Stack direction="row" sx={buttonStackSX}>
                <ActionButton
                  type="button"
                  minor
                  onClick={handleSubmit(onSignUp)}
                >
                  Sign Up
                </ActionButton>
                <ActionButton type="submit">Login</ActionButton>
              </Stack>
            </Stack>
          </Stack>
        </PaddedPaper>
      </Stack>
    </Stack>
  );
};
