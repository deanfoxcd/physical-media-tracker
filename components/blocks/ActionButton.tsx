"use client";

import { Button, type ButtonProps } from "@mui/material";
import Link from "next/link";
import type { ReactNode } from "react";

type PlainButtonProps = { href?: undefined; minor?: boolean } & Omit<
  ButtonProps,
  "component" | "variant"
>;

type LinkButtonProps = {
  href: string;
  minor?: boolean;
  children: ReactNode;
  disabled?: boolean;
  sx?: ButtonProps["sx"];
};

type ActionButtonProps = LinkButtonProps | PlainButtonProps;

export const ActionButton = (props: ActionButtonProps) => {
  const variant = props.minor ? "outlined" : "contained";

  if (props.href) {
    const { href, children, disabled, sx } = props;
    return (
      <Button
        variant={variant}
        component={Link}
        href={href}
        disabled={disabled}
        sx={sx}
      >
        {children}
      </Button>
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { href, minor, ...rest } = props;
  return <Button variant={variant} {...rest} />;
};
