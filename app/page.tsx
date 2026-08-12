import { ButtonSolid } from "@/components/blocks/ButtonSolid";
import { Search } from "@/components/blocks/Search";
import { Stack, Typography } from "@mui/material";

export default function Home() {
  return (
    <Stack spacing={3}>
      <Typography variant="h1" align="center">
        Physical Media Tracker
      </Typography>
      <Stack direction="row" spacing={2} sx={{ justifyContent: "center" }}>
        <ButtonSolid>My Collection</ButtonSolid>
        <ButtonSolid>Wishlist</ButtonSolid>
      </Stack>
      <Stack spacing={1}>
        <Typography>Find a movie or show:</Typography>
        <Search />
      </Stack>
    </Stack>
  );
}
