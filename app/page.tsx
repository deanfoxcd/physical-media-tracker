import { Search } from "@/components/blocks/Search";
import { Stack, Typography } from "@mui/material";
import localization from "@/locales/en";
import { ActionButton } from "@/components/blocks/ActionButton";

export default function Home() {
  return (
    <Stack spacing={3}>
      <Typography variant="h1" align="center">
        {localization.pageTitle}
      </Typography>
      <Stack direction="row" spacing={2} sx={{ justifyContent: "center" }}>
        <ActionButton href="/collection">
          {localization.collectionButton}
        </ActionButton>
        <ActionButton href="/wishlist">
          {localization.wishlistButton}
        </ActionButton>
      </Stack>
      <Stack spacing={1}>
        <Typography>{localization.searchInstructions}</Typography>
        <Search />
      </Stack>
    </Stack>
  );
}
