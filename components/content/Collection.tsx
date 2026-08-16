"use client";

import { Box, Stack, Typography } from "@mui/material";
import { useSavedMedia } from "@/hooks/useSavedMedia";
import localization from "@/locales/en";
import { MediaCard } from "../blocks/MediaCard";
import { ActionButton } from "../blocks/ActionButton";
import { PaddedPaper } from "../blocks/PaddedPaper";

export const Collection = () => {
  const { items, removeItem, updateItem, loading } = useSavedMedia("owned");

  if (loading) return <Typography>Loading...</Typography>;

  return (
    <Stack spacing={2}>
      <Typography variant="h4" sx={{ alignItems: "center" }}>
        {localization.collection.title}
      </Typography>
      <Box>
        <ActionButton minor href="/">
          Back to search
        </ActionButton>
      </Box>
      {items.length === 0 ? (
        <Typography>No saved items yet.</Typography>
      ) : (
        <Stack spacing={2}>
          <PaddedPaper sx={{ width: "80%", alignSelf: "center" }}>
            <Stack spacing={3}>
              {items.map((item) => (
                <MediaCard
                  key={item.id}
                  savedItem={item}
                  onRemoved={removeItem}
                  onUpdated={updateItem}
                />
              ))}
            </Stack>
          </PaddedPaper>
        </Stack>
      )}
    </Stack>
  );
};
