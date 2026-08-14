"use client";

import { Button } from "@mui/material";
import Link from "next/link";

interface ButtonSolidProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  href?: string;
}

export const ButtonSolid = ({
  children,
  onClick,
  disabled,
  href,
}: ButtonSolidProps) => {
  if (href) {
    return (
      <Button
        variant="contained"
        component={Link}
        href={href}
        disabled={disabled}
      >
        {children}
      </Button>
    );
  }

  return (
    <Button variant="contained" onClick={onClick} disabled={disabled}>
      {children}
    </Button>
  );
};
