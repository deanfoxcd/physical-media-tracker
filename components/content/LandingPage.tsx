"use client";

import { Stack, Tab, Tabs, Typography } from "@mui/material";
import { Search } from "../blocks/Search";
import localization from "@/locales/en";
import { PaddedPaper } from "../blocks/PaddedPaper";
import React, { useState } from "react";
import { Collection } from "./Collection";
import { Wishlist } from "./Wishlist";
import { Header } from "../blocks/Header";
import { useSavedMedia } from "@/hooks/useSavedMedia";
import { SavedMedia, SavedMediaUpdates } from "@/types/media";

type Tabs = "collection" | "wishlist";

export const LandingPage = () => {
  const [openTab, setOpenTab] = useState<Tabs>("collection");
  const owned = useSavedMedia("owned");
  const wishlist = useSavedMedia("wishlist");

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
        <Typography>{localization.searchInstructions}</Typography>
        <Search onAdded={handleAdded} />
      </Stack>
      <PaddedPaper>
        <Stack spacing={3}>
          <Tabs value={openTab} onChange={handleOnChange}>
            <Tab value="collection" label="My Collection" />
            <Tab value="wishlist" label="My Wishlist" />
          </Tabs>
          {openTab === "collection" ? (
            <Collection {...owned} />
          ) : (
            <Wishlist {...wishlist} updateItem={handleWishlistUpdated} />
          )}
        </Stack>
      </PaddedPaper>
    </Stack>
  );
};
