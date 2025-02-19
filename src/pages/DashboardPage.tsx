import React, { useState, useMemo } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
} from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { format, startOfDay, endOfDay } from 'date-fns';
import { useTimeManagement } from '../contexts/TimeManagementContext';
import TimeEntryForm from '../components/TimeEntryForm';
import { CategoryDuration, TimeEntry } from '../types/models';

const DashboardPage: React.FC = () => {
  const { state } = useTimeManagement();
  const [selectedDate] = useState(new Date());

  const todayEntries = useMemo(() => {
    const dayStart = startOfDay(selectedDate);
    const dayEnd = endOfDay(selectedDate);
    return state.timeEntries.filter(
      (entry) => entry.datetime >= dayStart && entry.datetime <= dayEnd
    );
  }, [state.timeEntries, selectedDate]);

  const categoryStats = useMemo(() => {
    const stats: Record<string, CategoryDuration> = {};
    todayEntries.forEach((entry) => {
      if (!stats[entry.categoryId]) {
        stats[entry.categoryId] = { categoryId: entry.categoryId, duration: 0 };
      }
      stats[entry.categoryId].duration += entry.duration;
    });
    return Object.values(stats);
  }, [todayEntries]);

  const totalDuration = useMemo(
    () => todayEntries.reduce((sum, entry) => sum + entry.duration, 0),
    [todayEntries]
  );

  const getCategoryColor = (categoryId: string) => {
    const category = state.categories.find((c) => c.id === categoryId);
    return category?.color || '#000000';
  };

  const getCategoryName = (categoryId: string) => {
    const category = state.categories.find((c) => c.id === categoryId);
    return category?.name || 'Unknown';
  };

  const chartData = categoryStats.map((stat) => ({
    name: getCategoryName(stat.categoryId),
    value: stat.duration,
    color: getCategoryColor(stat.categoryId),
  }));

  return (
    <Box>
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Today's Timesheet ({format(selectedDate, 'MMM dd, yyyy')})
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Time</TableCell>
                    <TableCell>Category</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell align="right">Duration</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {todayEntries.map((entry: TimeEntry) => (
                    <TableRow key={entry.id}>
                      <TableCell>{format(entry.datetime, 'HH:mm')}</TableCell>
                      <TableCell>
                        <Chip
                          label={getCategoryName(entry.categoryId)}
                          size="small"
                          style={{ backgroundColor: getCategoryColor(entry.categoryId) }}
                        />
                      </TableCell>
                      <TableCell>{entry.description}</TableCell>
                      <TableCell align="right">{entry.duration} min</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>

          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Category Distribution
            </Typography>
            <Box sx={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" name="Duration (min)">
                    {chartData.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Quick Entry
            </Typography>
            <TimeEntryForm />
          </Paper>

          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Today's Summary
            </Typography>
            <Box sx={{ height: 200 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    label
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Box>
            <Typography variant="body1" align="center" sx={{ mt: 2 }}>
              Total Time: {Math.round(totalDuration / 60 * 10) / 10} hours
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardPage;