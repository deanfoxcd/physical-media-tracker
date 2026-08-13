import { Paper } from "@mui/material";

export const PaddedPaper = ({ children }: { children: React.ReactNode }) => {
  return (
    <Paper
      square={false}
      sx={{
        padding: "15px",
      }}
    >
      {children}
    </Paper>
  );
};
