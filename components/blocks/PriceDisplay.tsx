import { Typography } from "@mui/material";

export const PriceDisplay = ({ price }: { price: number }) => {
  return (
    <Typography>
      {price.toLocaleString("en-US", { style: "currency", currency: "USD" })}
    </Typography>
  );
};
