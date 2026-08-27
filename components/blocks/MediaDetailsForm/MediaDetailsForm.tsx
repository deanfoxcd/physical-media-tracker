import {
  InputAdornment,
  MenuItem,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { SavedMediaFields } from "@/types/media";
import { Controller, useForm } from "react-hook-form";
import { useState } from "react";
import { ActionButton } from "../ActionButton";
import { FORMAT_OPTIONS } from "@/constants/formatOptions";
import { buttonStackSX, headerStackSX, priceSX } from "./styles";

export type MediaDetailsFormValues = Omit<
  SavedMediaFields,
  "tmdbId" | "pricePaid" | "imdbId" | "status" | "userId"
> & {
  pricePaid: number | "";
};

interface MediaDetailsFormProps {
  defaultValues: MediaDetailsFormValues;
  onSubmit: (values: MediaDetailsFormValues) => Promise<void> | void;
  onCancel: () => void;
  title?: string;
  onDelete?: () => Promise<void> | void;
  deleteLabel?: string;
}

export const MediaDetailsForm = ({
  defaultValues,
  onSubmit,
  onCancel,
  title,
  onDelete,
  deleteLabel = "Remove",
}: MediaDetailsFormProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [deleting, setDeleting] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { isSubmitting },
  } = useForm<MediaDetailsFormValues>({
    defaultValues,
  });

  const priceField = register("pricePaid", {
    setValueAs: (v) => (v === "" ? "" : Math.round(Number(v) * 100) / 100),
  });

  async function handleDelete() {
    if (!onDelete) return;
    setDeleting(true);
    try {
      await onDelete();
    } finally {
      setDeleting(false);
    }
  }

  return (
    <Stack component="form" onSubmit={handleSubmit(onSubmit)} spacing={2}>
      {title ? (
        <Stack direction="row" sx={headerStackSX}>
          <Typography variant="h6">{title}</Typography>
          <ActionButton
            minor
            onClick={onCancel}
            size={isMobile ? "small" : "medium"}
          >
            X
          </ActionButton>
        </Stack>
      ) : null}
      <Controller
        name="format"
        control={control}
        render={({ field }) => (
          <TextField
            label="Format:"
            size={isMobile ? "small" : "medium"}
            select
            slotProps={{ select: { MenuProps: { disablePortal: true } } }}
            {...field}
          >
            {FORMAT_OPTIONS.map((format) => (
              <MenuItem key={format} value={format}>
                {format}
              </MenuItem>
            ))}
          </TextField>
        )}
      />
      <TextField
        label="Condition:"
        {...register("condition")}
        size={isMobile ? "small" : "medium"}
      />
      <TextField
        label="Acquired from:"
        {...register("acquiredFrom")}
        size={isMobile ? "small" : "medium"}
      />
      <TextField
        label="Acquired date:"
        type="date"
        slotProps={{ inputLabel: { shrink: true } }}
        {...register("acquiredDate")}
        size={isMobile ? "small" : "medium"}
      />
      <TextField
        label="Price Paid:"
        type="number"
        sx={priceSX}
        slotProps={{
          input: {
            startAdornment: <InputAdornment position="start">$</InputAdornment>,
          },
          htmlInput: { min: 0, step: 0.01 },
        }}
        {...priceField}
        onChange={(e) => {
          e.target.value = e.target.value.replace(/(\.\d{2})\d+$/, "$1");
          priceField.onChange(e);
        }}
        size={isMobile ? "small" : "medium"}
      />
      <TextField
        label="Notes:"
        multiline
        {...register("notes")}
        size={isMobile ? "small" : "medium"}
      />
      <TextField
        label="Review:"
        multiline
        {...register("review")}
        size={isMobile ? "small" : "medium"}
      />
      <Controller
        name="rating"
        control={control}
        render={({ field }) => (
          <TextField
            label="Rating out of 10:"
            size={isMobile ? "small" : "medium"}
            select
            slotProps={{ select: { MenuProps: { disablePortal: true } } }}
            {...field}
          >
            {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
              <MenuItem key={n} value={n}>
                {n}
              </MenuItem>
            ))}
          </TextField>
        )}
      />
      <Stack direction="row" spacing={2} sx={buttonStackSX}>
        {onDelete && (
          <ActionButton
            onClick={handleDelete}
            disabled={deleting}
            minor
            size={isMobile ? "small" : "medium"}
          >
            {deleting ? "Removing..." : deleteLabel}
          </ActionButton>
        )}
        <ActionButton
          type="submit"
          disabled={isSubmitting}
          size={isMobile ? "small" : "medium"}
        >
          {isSubmitting ? "Saving..." : "Save to Your Collection"}
        </ActionButton>
      </Stack>
    </Stack>
  );
};
