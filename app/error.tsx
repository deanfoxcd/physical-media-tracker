"use client";

import { useEffect } from "react";
import { Stack, Typography } from "@mui/material";
import { Header } from "@/components/blocks/Header/Header";
import { PaddedPaper } from "@/components/blocks/PaddedPaper";
import { ActionButton } from "@/components/blocks/ActionButton";
import { errorTextSX, innerStackSX, textStackSX } from "./styles/error";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <Stack spacing={5}>
      <Header />
      <Stack sx={innerStackSX}>
        <PaddedPaper>
          <Stack spacing={3} sx={textStackSX}>
            <Typography variant="h4">Something went wrong</Typography>
            <Typography sx={errorTextSX}>
              An unexpected error occurred. Please try again.
            </Typography>
            <ActionButton onClick={reset}>Try again</ActionButton>
          </Stack>
        </PaddedPaper>
      </Stack>
    </Stack>
  );
}
