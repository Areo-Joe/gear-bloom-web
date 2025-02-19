import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
  FormHelperText,
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers';
import { useTimeManagement } from '../contexts/TimeManagementContext';

const timeEntrySchema = z.object({
  datetime: z.date(),
  categoryId: z.string().min(1, 'Category is required'),
  description: z.string().min(1, 'Description is required').max(200, 'Description is too long'),
  duration: z.number().min(1, 'Duration must be at least 1 minute').max(1440, 'Duration cannot exceed 24 hours'),
});

type TimeEntryFormData = z.infer<typeof timeEntrySchema>;

interface TimeEntryFormProps {
  onSuccess?: () => void;
  initialValues?: Partial<TimeEntryFormData>;
}

const TimeEntryForm: React.FC<TimeEntryFormProps> = ({ onSuccess, initialValues }) => {
  const { state, addTimeEntry } = useTimeManagement();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TimeEntryFormData>({
    resolver: zodResolver(timeEntrySchema),
    defaultValues: {
      datetime: initialValues?.datetime || new Date(),
      categoryId: initialValues?.categoryId || '',
      description: initialValues?.description || '',
      duration: initialValues?.duration || 30,
    },
  });

  const onSubmit = (data: TimeEntryFormData) => {
    addTimeEntry(data);
    reset();
    if (onSuccess) {
      onSuccess();
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        maxWidth: 'sm',
        margin: 'auto',
        padding: 2,
      }}
    >
      <Typography variant="h6" gutterBottom>
        New Time Entry
      </Typography>

      <Controller
        name="datetime"
        control={control}
        render={({ field }) => (
          <DateTimePicker
            label="Date and Time"
            value={field.value}
            onChange={(newValue) => field.onChange(newValue)}
            slotProps={{
              textField: {
                helperText: errors.datetime?.message,
                error: !!errors.datetime,
                fullWidth: true,
              },
            }}
          />
        )}
      />

      <Controller
        name="categoryId"
        control={control}
        render={({ field }) => (
          <FormControl fullWidth error={!!errors.categoryId}>
            <InputLabel>Category</InputLabel>
            <Select {...field} label="Category">
              {state.categories.map((category) => (
                <MenuItem key={category.id} value={category.id}>
                  {category.name}
                </MenuItem>
              ))}
            </Select>
            {errors.categoryId && (
              <FormHelperText>{errors.categoryId.message}</FormHelperText>
            )}
          </FormControl>
        )}
      />

      <Controller
        name="description"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            label="Description"
            multiline
            rows={3}
            error={!!errors.description}
            helperText={errors.description?.message}
            fullWidth
          />
        )}
      />

      <Controller
        name="duration"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            type="number"
            label="Duration (minutes)"
            error={!!errors.duration}
            helperText={errors.duration?.message}
            fullWidth
            InputProps={{ inputProps: { min: 1, max: 1440 } }}
            onChange={(e) => field.onChange(Number(e.target.value))}
          />
        )}
      />

      <Button
        type="submit"
        variant="contained"
        color="primary"
        size="large"
        sx={{ mt: 2 }}
      >
        Save Time Entry
      </Button>
    </Box>
  );
};

export default TimeEntryForm;