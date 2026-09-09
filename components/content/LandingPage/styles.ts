import { SxProps, Theme } from "@mui/material";

export const collectionBoxSX = (openTab: string): SxProps<Theme> => ({
  display: openTab === "collection" ? "block" : "none",
});

export const mainStackSX: SxProps = { px: { xs: 2, sm: 3, md: 0 } };

export const paperSX =
  (layout: "grid" | "list"): SxProps<Theme> =>
  (theme) => ({
    width: "100%",
    maxWidth: layout === "list" ? "1000px" : "1200px",
    alignSelf: "center",
    bgcolor: theme.palette.tray.main,
    borderColor: theme.palette.tray.border,
  });

export const tabsSX: SxProps<Theme> = (theme) => ({
  bgcolor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.divider}`,
  borderBottom: "none",
  borderTopLeftRadius: "10px",
  borderTopRightRadius: "10px",
  "& .MuiTab-root": {
    fontSize: { xs: "0.8rem", sm: "1.2rem" },
  },
});

export const wishlistBoxSX = (openTab: string): SxProps<Theme> => ({
  display: openTab === "wishlist" ? "block" : "none",
});
