import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Divider,
  Chip,
  Grid,
} from '@mui/material';
import { Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';
import { format } from 'date-fns';
import TimeEntryForm from '../components/TimeEntryForm';
import { useTimeManagement } from '../contexts/TimeManagementContext';
import { TimeEntry } from '../types/models';

const TimeEntryPage: React.FC = () => {
  const { state, deleteTimeEntry } = useTimeManagement();
  const [selectedEntry, setSelectedEntry] = useState<TimeEntry | null>(null);

  const getCategoryName = (categoryId: string) => {
    const category = state.categories.find((c) => c.id === categoryId);
    return category?.name || 'Unknown Category';
  };

  const handleEdit = (entry: TimeEntry) => {
    setSelectedEntry(entry);
  };

  const handleDelete = (entryId: string) => {
    if (window.confirm('Are you sure you want to delete this time entry?')) {
      deleteTimeEntry(entryId);
    }
  };

  const handleFormSuccess = () => {
    setSelectedEntry(null);
  };

  return (
    <Box sx={{ maxWidth: 'lg', mx: 'auto', p: 2 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h5" gutterBottom>
              {selectedEntry ? 'Edit Time Entry' : 'New Time Entry'}
            </Typography>
            <TimeEntryForm
              onSuccess={handleFormSuccess}
              initialValues={selectedEntry || undefined}
            />
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
              Recent Time Entries
            </Typography>
            <List>
              {state.timeEntries
                .sort((a, b) => b.datetime.getTime() - a.datetime.getTime())
                .map((entry) => (
                  <React.Fragment key={entry.id}>
                    <ListItem>
                      <ListItemText
                        primary={entry.description}
                        secondary={
                          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mt: 0.5 }}>
                            <Typography variant="body2" component="span">
                              {format(entry.datetime, 'PPp')}
                            </Typography>
                            <Chip
                              size="small"
                              label={getCategoryName(entry.categoryId)}
                              sx={{ ml: 1 }}
                            />
                            <Typography variant="body2" component="span" sx={{ ml: 1 }}>
                              {entry.duration} minutes
                            </Typography>
                          </Box>
                        }
                      />
                      <ListItemSecondaryAction>
                        <IconButton
                          edge="end"
                          aria-label="edit"
                          onClick={() => handleEdit(entry)}
                          sx={{ mr: 1 }}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          edge="end"
                          aria-label="delete"
                          onClick={() => handleDelete(entry.id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                    <Divider />
                  </React.Fragment>
                ))}
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default TimeEntryPage;