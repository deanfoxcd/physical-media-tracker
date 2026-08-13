import { Button } from "@mui/material";

type ButtonSolidProps = React.ComponentProps<typeof Button>;

export const ButtonSolid = ({ children, ...props }: ButtonSolidProps) => {
  return (
    <Button variant="contained" {...props}>
      {children}
    </Button>
  );
};
