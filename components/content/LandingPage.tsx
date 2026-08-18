"use client";

import { Box, Stack, Tab, Tabs, Typography } from "@mui/material";
import { Search } from "../blocks/Search";
import localization from "@/locales/en";
import { PaddedPaper } from "../blocks/PaddedPaper";
import React, { useState } from "react";
import { Header } from "../blocks/Header";
import { useSavedMedia } from "@/hooks/useSavedMedia";
import { SavedMedia, SavedMediaUpdates } from "@/types/media";
import { MediaList } from "../blocks/MediaList";

type Tabs = "collection" | "wishlist";

export const LandingPage = () => {
  const [openTab, setOpenTab] = useState<Tabs>("collection");
  const owned = useSavedMedia("owned");
  const wishlist = useSavedMedia("wishlist");
  const [layout, setLayout] = useState<"list" | "grid">("grid");

  const handleOnChange = (event: React.SyntheticEvent, value: Tabs) => {
    setOpenTab(value);
  };

  function handleAdded(item: SavedMedia & { id: string }) {
    if (item.status === "owned") {
      owned.addItem(item);
    } else {
      wishlist.addItem(item);
    }
  }

  function handleWishlistUpdated(id: string, updates: SavedMediaUpdates) {
    const existing = wishlist.items.find((i) => i.id === id);
    wishlist.updateItem(id, updates);

    if (existing && "status" in updates && updates.status === "owned") {
      owned.addItem({ ...existing, ...updates } as SavedMedia & { id: string });
    }
  }

  return (
    <Stack spacing={3}>
      <Header />

      <Stack spacing={1}>
        <Search onAdded={handleAdded} />
      </Stack>
      <PaddedPaper>
        <Stack spacing={3}>
          <Tabs value={openTab} onChange={handleOnChange}>
            <Tab value="collection" label="My Collection" />
            <Tab value="wishlist" label="My Wishlist" />
          </Tabs>
          <Box sx={{ display: openTab === "collection" ? "block" : "none" }}>
            <MediaList
              title={localization.collection.title}
              {...owned}
              layout={layout}
              onLayoutChange={setLayout}
            />
          </Box>
          <Box sx={{ display: openTab === "wishlist" ? "block" : "none" }}>
            <MediaList
              title={localization.wishlist.title}
              {...wishlist}
              updateItem={handleWishlistUpdated}
              layout={layout}
              onLayoutChange={setLayout}
            />
          </Box>
        </Stack>
      </PaddedPaper>
    </Stack>
  );
};
