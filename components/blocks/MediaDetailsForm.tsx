import {
  InputAdornment,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { SavedMediaFields } from "@/types/media";
import { Controller, useForm } from "react-hook-form";
import { ActionButton } from "./ActionButton";

export type MediaDetailsFormValues = Omit<
  SavedMediaFields,
  "tmdbId" | "pricePaid" | "imdbId"
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
  const { register, handleSubmit, control } = useForm<MediaDetailsFormValues>({
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
          <TextField label="Format:" select {...field}>
            <MenuItem value="DVD">DVD</MenuItem>
            <MenuItem value="Blu-Ray">Blu-ray</MenuItem>
            <MenuItem value="4K">4K</MenuItem>
            <MenuItem value="3D">3D</MenuItem>
            <MenuItem value="4K 3D">4K 3D</MenuItem>
            <MenuItem value="Digital">Digital</MenuItem>
            <MenuItem value="4K Digital">4K Digital</MenuItem>
          </TextField>
        )}
      />
      <TextField label="Condition:" {...register("condition")} />
      <TextField label="Acquired from:" {...register("acquiredFrom")} />
      <TextField
        label="Acquired date:"
        type="date"
        slotProps={{ inputLabel: { shrink: true } }}
        {...register("acquiredDate")}
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
      />
      <TextField label="Notes:" multiline {...register("notes")} />
      <TextField label="Review:" multiline {...register("review")} />
      <Controller
        name="rating"
        control={control}
        render={({ field }) => (
          <TextField label="Rating out of 10:" select {...field}>
            {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
              <MenuItem key={n} value={n}>
                {n}
              </MenuItem>
            ))}
          </TextField>
        )}
      />
      <Stack direction="row" spacing={2}>
        <ActionButton type="submit">Save</ActionButton>
        <ActionButton onClick={onCancel} minor>
          Cancel
        </ActionButton>
      </Stack>
    </Stack>
  );
};
