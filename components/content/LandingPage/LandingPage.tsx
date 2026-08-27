"use client";

import { Box, Stack, Tab, Tabs } from "@mui/material";
import { Search } from "../Search/Search";
import localization from "@/locales/en";
import { PaddedPaper } from "../../blocks/PaddedPaper";
import React, { useState } from "react";
import { Header } from "../../blocks/Header/Header";
import { useSavedMedia } from "@/hooks/useSavedMedia";
import { SavedMedia, SavedMediaUpdates } from "@/types/media";
import { MediaList } from "../MediaList/MediaList";
import { HelpBanner } from "../../blocks/HelpBanner/HelpBanner";
import {
  collectionBoxSX,
  mainStackSX,
  paperSX,
  tabsSX,
  wishlistBoxSX,
} from "./styles";

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
    <Stack spacing={3} sx={mainStackSX}>
      <Header signOut />

      <Stack spacing={1}>
        <Search
          onAdded={handleAdded}
          savedItems={[...owned.items, ...wishlist.items]}
        />
      </Stack>
      <PaddedPaper sx={paperSX(layout)}>
        <Stack spacing={3}>
          <Tabs
            value={openTab}
            onChange={handleOnChange}
            variant="fullWidth"
            sx={tabsSX}
          >
            <Tab value="collection" label="My Collection" />
            <Tab value="wishlist" label="My Wishlist" />
          </Tabs>
          <Box sx={collectionBoxSX(openTab)}>
            <MediaList
              title={localization.collection.title}
              {...owned}
              layout={layout}
              onLayoutChange={setLayout}
              status="owned"
            />
          </Box>
          <Box sx={wishlistBoxSX(openTab)}>
            <MediaList
              title={localization.wishlist.title}
              {...wishlist}
              updateItem={handleWishlistUpdated}
              layout={layout}
              onLayoutChange={setLayout}
              status="wishlist"
            />
          </Box>
        </Stack>
      </PaddedPaper>
      <HelpBanner />
    </Stack>
  );
};
