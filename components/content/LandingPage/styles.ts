import { SxProps, Theme } from "@mui/material";

export const collectionBoxSX = (openTab: string): SxProps<Theme> => ({
  display: openTab === "collection" ? "block" : "none",
});

export const mainStackSX: SxProps = { px: { xs: 2, sm: 3, md: 0 } };

export const paperSX = (layout: "grid" | "list"): SxProps<Theme> => ({
  width: "100%",
  maxWidth: layout === "list" ? "1000px" : "1200px",
  alignSelf: "center",
});

export const tabsSX: SxProps = {
  "& .MuiTab-root": {
    fontSize: { xs: "0.8rem", sm: "1.2rem" },
  },
};

export const wishlistBoxSX = (openTab: string): SxProps<Theme> => ({
  display: openTab === "wishlist" ? "block" : "none",
});
