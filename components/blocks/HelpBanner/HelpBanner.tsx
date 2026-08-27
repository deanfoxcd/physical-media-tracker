"use client";

import { useEffect, useState } from "react";
import { Paper, Stack, Typography, IconButton } from "@mui/material";
import { Close } from "@mui/icons-material";
import { mainStackSX, paperSX } from "./styles";
import { DISMISSED_KEY } from "@/constants/helpBanner";

export const HelpBanner = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setVisible(localStorage.getItem(DISMISSED_KEY) !== "true");
  }, []);

  function handleDismiss() {
    localStorage.setItem(DISMISSED_KEY, "true");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <Paper elevation={4} sx={paperSX}>
      <Stack direction="row" spacing={2} sx={mainStackSX}>
        <Typography variant="body2">
          Click on the poster for more details and to edit details. Click on the
          title to see the IMDb page.
        </Typography>
        <IconButton size="small" onClick={handleDismiss}>
          <Close fontSize="small" />
        </IconButton>
      </Stack>
    </Paper>
  );
};
