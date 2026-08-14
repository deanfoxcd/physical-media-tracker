"use client";

import { Box, Stack, Typography } from "@mui/material";
import { useSavedMedia } from "@/hooks/useSavedMedia";
import localization from "@/locales/en";
import { MediaCard } from "../blocks/MediaCard";
import { ActionButton } from "../blocks/ActionButton";

export const Collection = () => {
  const { items, loading } = useSavedMedia();

  if (loading) return <Typography>Loading...</Typography>;
  if (items.length === 0) return <Typography>No saved items yet.</Typography>;

  return (
    <Stack spacing={2}>
      <Typography variant="h4">{localization.collection.title}</Typography>
      <Box>
        <ActionButton minor href="/">
          Back to search
        </ActionButton>
      </Box>
      <Stack spacing={2}>
        {items.map((item) => (
          <MediaCard key={item.id} savedItem={item} />
        ))}
      </Stack>
    </Stack>
  );
};
