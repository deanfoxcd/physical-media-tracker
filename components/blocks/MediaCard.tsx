import { TmdbMultiResult } from "@/types/tmdb";
import { Button, Stack, Typography } from "@mui/material";
import Image from "next/image";
import { ButtonSolid } from "./ButtonSolid";
import { PaddedPaper } from "./PaddedPaper";
import { useState } from "react";
import { SavedMedia } from "@/types/media";
import { addSavedMedia } from "@/services/media";

interface MediaCardProps {
  item: TmdbMultiResult;
}

const POSTER_BASE = "https://image.tmdb.org/t/p/w154";

export const MediaCard = ({ item }: MediaCardProps) => {
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  if (item.media_type === "person") return null;

  async function handleAddToCollection() {
    if (item.media_type === "person") return;

    const { id, ...rest } = item;
    const newSavedMedia: SavedMedia = {
      ...rest,
      tmdbId: id,
      format: "dvd",
      condition: "",
      acquiredFrom: "",
      acquiredDate: "",
      pricePaid: 0,
      notes: "",
      review: "",
    };

    setSaving(true);
    try {
      await addSavedMedia(newSavedMedia);
      setSaved(true);
    } finally {
      setSaving(false);
    }
  }

  return (
    <PaddedPaper>
      <Stack direction="row" sx={{ justifyContent: "space-between" }}>
        <Stack key={item.id} direction="row" spacing={2}>
          {item.poster_path && (
            <Image
              src={`${POSTER_BASE}${item.poster_path}`}
              alt={item.media_type === "movie" ? item.title : item.name}
              width={92}
              height={138}
            />
          )}
          <Button key={item.id} onClick={() => console.log(item)}>
            <Typography>
              {item.media_type === "movie" ? item.title : item.name} (
              {(item.media_type === "movie"
                ? item.release_date
                : item.first_air_date
              )?.slice(0, 4)}
              )
            </Typography>
          </Button>
        </Stack>

        <Stack spacing={1}>
          <ButtonSolid
            onClick={handleAddToCollection}
            disabled={saving || saved}
          >
            {saved ? "Added" : saving ? "Adding..." : "Add to Collection"}
          </ButtonSolid>
          <ButtonSolid>Add to Watchlist</ButtonSolid>
        </Stack>
      </Stack>
    </PaddedPaper>
  );
};
