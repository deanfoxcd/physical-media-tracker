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
import { ActionButton } from "./ActionButton";
import { FORMAT_OPTIONS } from "@/constants/formatOptions";

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
}

export const MediaDetailsForm = ({
  defaultValues,
  onSubmit,
  onCancel,
  title,
}: MediaDetailsFormProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

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

  return (
    <Stack component="form" onSubmit={handleSubmit(onSubmit)} spacing={2}>
      {title ? <Typography variant="h6">{title}</Typography> : null}
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
        sx={{
          "& input[type=number]": { MozAppearance: "textfield" },
          "& input[type=number]::-webkit-outer-spin-button": {
            WebkitAppearance: "none",
            margin: 0,
          },
          "& input[type=number]::-webkit-inner-spin-button": {
            WebkitAppearance: "none",
            margin: 0,
          },
        }}
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
      <Stack direction="row" spacing={2}>
        <ActionButton
          type="submit"
          disabled={isSubmitting}
          size={isMobile ? "small" : "medium"}
        >
          {isSubmitting ? "Saving..." : "Save to Your Collection"}
        </ActionButton>
        <ActionButton
          onClick={onCancel}
          minor
          size={isMobile ? "small" : "medium"}
        >
          Cancel
        </ActionButton>
      </Stack>
    </Stack>
  );
};
