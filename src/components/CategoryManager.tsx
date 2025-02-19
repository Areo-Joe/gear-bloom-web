import React, { useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  TextField,
  Typography,
} from '@mui/material';
import { Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';
import { MuiColorInput } from 'mui-color-input';
import { useTimeManagement } from '../contexts/TimeManagementContext';
import { Category } from '../types/models';

interface CategoryFormData {
  name: string;
  color: string;
}

const CategoryManager: React.FC = () => {
  const { state, addCategory, updateCategory, deleteCategory } = useTimeManagement();
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState<CategoryFormData>({ name: '', color: '#000000' });
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleOpenDialog = (category?: Category) => {
    if (category) {
      setFormData({ name: category.name, color: category.color });
      setEditingId(category.id);
    } else {
      setFormData({ name: '', color: '#000000' });
      setEditingId(null);
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setFormData({ name: '', color: '#000000' });
    setEditingId(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name.trim()) {
      if (editingId) {
        updateCategory({
          id: editingId,
          ...formData,
        });
      } else {
        addCategory(formData);
      }
      handleCloseDialog();
    }
  };

  const handleDelete = (categoryId: string) => {
    if (window.confirm('Are you sure you want to delete this category? All associated time entries will also be deleted.')) {
      deleteCategory(categoryId);
    }
  };

  return (
    <Box sx={{ maxWidth: 600, margin: '0 auto', p: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5">Categories</Typography>
        <Button variant="contained" color="primary" onClick={() => handleOpenDialog()}>
          Add Category
        </Button>
      </Box>

      <List>
        {state.categories.map((category) => (
          <ListItem
            key={category.id}
            sx={{
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 1,
              mb: 1,
            }}
          >
            <Box
              sx={{
                width: 24,
                height: 24,
                borderRadius: '50%',
                backgroundColor: category.color,
                mr: 2,
              }}
            />
            <ListItemText primary={category.name} />
            <ListItemSecondaryAction>
              <IconButton edge="end" onClick={() => handleOpenDialog(category)} sx={{ mr: 1 }}>
                <EditIcon />
              </IconButton>
              <IconButton edge="end" onClick={() => handleDelete(category.id)}>
                <DeleteIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>{editingId ? 'Edit Category' : 'Add Category'}</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Category Name"
              fullWidth
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
            <Box sx={{ mt: 2 }}>
              <MuiColorInput
                value={formData.color}
                onChange={(color) => setFormData({ ...formData, color })}
                format="hex"
                label="Category Color"
                fullWidth
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button type="submit" variant="contained" color="primary">
              {editingId ? 'Save' : 'Add'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default CategoryManager;