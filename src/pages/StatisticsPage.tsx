import React, { useMemo, useState } from 'react';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  SelectChangeEvent,
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
  LineChart,
  Line,
  CartesianGrid,
  Legend,
} from 'recharts';
import { format, startOfWeek, endOfWeek, eachDayOfInterval, addWeeks, subWeeks } from 'date-fns';
import { useTimeManagement } from '../contexts/TimeManagementContext';
import { CategoryDistribution, WeeklyTrend } from '../types/models';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const StatisticsPage: React.FC = () => {
  const { state } = useTimeManagement();
  const [timeRange, setTimeRange] = useState<string>('week');

  const handleTimeRangeChange = (event: SelectChangeEvent) => {
    setTimeRange(event.target.value);
  };

  const categoryDistribution = useMemo((): CategoryDistribution[] => {
    const distribution: Record<string, number> = {};
    let total = 0;

    state.timeEntries.forEach((entry) => {
      distribution[entry.categoryId] = (distribution[entry.categoryId] || 0) + entry.duration;
      total += entry.duration;
    });

    return Object.entries(distribution).map(([categoryId, duration]) => ({
      categoryId,
      totalDuration: duration,
      percentage: (duration / total) * 100,
    }));
  }, [state.timeEntries]);

  const weeklyData = useMemo((): WeeklyTrend[] => {
    const now = new Date();
    const startDate = subWeeks(startOfWeek(now), 3);
    const endDate = endOfWeek(now);
    const weeks: WeeklyTrend[] = [];

    let currentStart = startDate;
    while (currentStart <= endDate) {
      const currentEnd = endOfWeek(currentStart);
      const entriesInWeek = state.timeEntries.filter(
        (entry) => entry.datetime >= currentStart && entry.datetime <= currentEnd
      );

      const categoryBreakdown = state.categories.map((category) => ({
        categoryId: category.id,
        duration: entriesInWeek
          .filter((entry) => entry.categoryId === category.id)
          .reduce((sum, entry) => sum + entry.duration, 0),
      }));

      weeks.push({
        weekStartDate: currentStart,
        totalDuration: entriesInWeek.reduce((sum, entry) => sum + entry.duration, 0),
        categoriesBreakdown: categoryBreakdown,
      });

      currentStart = addWeeks(currentStart, 1);
    }

    return weeks;
  }, [state.timeEntries, state.categories]);

  const getCategoryName = (categoryId: string) => {
    return state.categories.find((c) => c.id === categoryId)?.name || 'Unknown';
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" gutterBottom align="center">
          Time Statistics
        </Typography>

        <FormControl sx={{ mb: 4, minWidth: 200 }}>
          <InputLabel>Time Range</InputLabel>
          <Select value={timeRange} onChange={handleTimeRangeChange} label="Time Range">
            <MenuItem value="week">Past Week</MenuItem>
            <MenuItem value="month">Past Month</MenuItem>
            <MenuItem value="year">Past Year</MenuItem>
          </Select>
        </FormControl>

        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, height: '400px' }}>
              <Typography variant="h6" gutterBottom>
                Category Distribution
              </Typography>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryDistribution}
                    dataKey="totalDuration"
                    nameKey="categoryId"
                    cx="50%"
                    cy="50%"
                    label={({ categoryId }) => getCategoryName(categoryId)}
                  >
                    {categoryDistribution.map((entry, index) => (
                      <Cell key={entry.categoryId} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number, name: string) => [
                      formatDuration(value),
                      getCategoryName(name),
                    ]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, height: '400px' }}>
              <Typography variant="h6" gutterBottom>
                Weekly Trends
              </Typography>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="weekStartDate"
                    tickFormatter={(date) => format(new Date(date), 'MMM d')}
                  />
                  <YAxis tickFormatter={(minutes) => `${Math.floor(minutes / 60)}h`} />
                  <Tooltip
                    formatter={(value: number) => formatDuration(value)}
                    labelFormatter={(date) => format(new Date(date), 'MMMM d, yyyy')}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="totalDuration"
                    stroke="#8884d8"
                    name="Total Time"
                  />
                </LineChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default StatisticsPage;