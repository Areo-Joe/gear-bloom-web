export interface TimeEntry {
  id: string;
  datetime: Date;
  categoryId: string;
  description: string;
  duration: number; // Duration in minutes
}

export interface Category {
  id: string;
  name: string;
  color: string; // Hex color code
}

export interface TimesheetEntry {
  date: Date;
  entries: TimeEntry[];
  totalDuration: number;
  categoryBreakdown: CategoryDuration[];
}

export interface CategoryDuration {
  categoryId: string;
  duration: number;
}

export interface TimeStatistics {
  totalHours: number;
  categoriesDistribution: CategoryDistribution[];
  dailyAverages: DailyAverage[];
  weeklyTrends: WeeklyTrend[];
}

export interface CategoryDistribution {
  categoryId: string;
  totalDuration: number;
  percentage: number;
}

export interface DailyAverage {
  date: Date;
  averageDuration: number;
  categories: CategoryDuration[];
}

export interface WeeklyTrend {
  weekStartDate: Date;
  totalDuration: number;
  categoriesBreakdown: CategoryDuration[];
}

export interface DateRange {
  startDate: Date;
  endDate: Date;
}

export interface TimesheetFilter {
  dateRange?: DateRange;
  categories?: string[];
  searchTerm?: string;
}