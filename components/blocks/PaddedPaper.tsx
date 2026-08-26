import { Paper, type SxProps, type Theme } from "@mui/material";

interface PaddedPaperProps {
  children: React.ReactNode;
  sx?: SxProps<Theme>;
}

export const PaddedPaper = ({ children, sx }: PaddedPaperProps) => {
  return (
    <Paper square={false} sx={[{ p: 2 }, ...(Array.isArray(sx) ? sx : [sx])]}>
      {children}
    </Paper>
  );
};
