import { ButtonSolid } from "@/components/blocks/ButtonSolid";
import { Search } from "@/components/blocks/Search";
import { Stack, Typography } from "@mui/material";
import localization from "@/locales/en";

export default function Home() {
  return (
    <Stack spacing={3}>
      <Typography variant="h1" align="center">
        {localization.pageTitle}
      </Typography>
      <Stack direction="row" spacing={2} sx={{ justifyContent: "center" }}>
        <ButtonSolid href="/collection">
          {localization.collectionButton}
        </ButtonSolid>
        <ButtonSolid>{localization.wishlistButton}</ButtonSolid>
      </Stack>
      <Stack spacing={1}>
        <Typography>{localization.searchInstructions}</Typography>
        <Search />
      </Stack>
    </Stack>
  );
}
