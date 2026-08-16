"use client";

import { Box, Stack, Typography } from "@mui/material";
import { ActionButton } from "../blocks/ActionButton";
import { MediaCard } from "../blocks/MediaCard";
import localization from "../../locales/en";
import { useSavedMedia } from "@/hooks/useSavedMedia";

export const Wishlist = () => {
  const { items, loading, removeItem, updateItem } = useSavedMedia("wishlist");

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
          <MediaCard
            key={item.id}
            savedItem={item}
            onRemoved={removeItem}
            onUpdated={updateItem}
          />
        ))}
      </Stack>
    </Stack>
  );
};
