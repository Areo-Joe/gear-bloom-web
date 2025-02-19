import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { TimeEntry, Category } from '../types/models';

interface TimeManagementState {
  timeEntries: TimeEntry[];
  categories: Category[];
}

type Action =
  | { type: 'ADD_TIME_ENTRY'; payload: TimeEntry }
  | { type: 'UPDATE_TIME_ENTRY'; payload: TimeEntry }
  | { type: 'DELETE_TIME_ENTRY'; payload: string }
  | { type: 'ADD_CATEGORY'; payload: Category }
  | { type: 'UPDATE_CATEGORY'; payload: Category }
  | { type: 'DELETE_CATEGORY'; payload: string }
  | { type: 'LOAD_DATA'; payload: TimeManagementState };

interface TimeManagementContextType {
  state: TimeManagementState;
  addTimeEntry: (entry: Omit<TimeEntry, 'id'>) => void;
  updateTimeEntry: (entry: TimeEntry) => void;
  deleteTimeEntry: (id: string) => void;
  addCategory: (category: Omit<Category, 'id'>) => void;
  updateCategory: (category: Category) => void;
  deleteCategory: (id: string) => void;
}

const initialState: TimeManagementState = {
  timeEntries: [],
  categories: [],
};

const TimeManagementContext = createContext<TimeManagementContextType | undefined>(undefined);

function timeManagementReducer(state: TimeManagementState, action: Action): TimeManagementState {
  switch (action.type) {
    case 'ADD_TIME_ENTRY':
      return {
        ...state,
        timeEntries: [...state.timeEntries, action.payload],
      };
    case 'UPDATE_TIME_ENTRY':
      return {
        ...state,
        timeEntries: state.timeEntries.map((entry) =>
          entry.id === action.payload.id ? action.payload : entry
        ),
      };
    case 'DELETE_TIME_ENTRY':
      return {
        ...state,
        timeEntries: state.timeEntries.filter((entry) => entry.id !== action.payload),
      };
    case 'ADD_CATEGORY':
      return {
        ...state,
        categories: [...state.categories, action.payload],
      };
    case 'UPDATE_CATEGORY':
      return {
        ...state,
        categories: state.categories.map((category) =>
          category.id === action.payload.id ? action.payload : category
        ),
      };
    case 'DELETE_CATEGORY':
      return {
        ...state,
        categories: state.categories.filter((category) => category.id !== action.payload),
        timeEntries: state.timeEntries.filter((entry) => entry.categoryId !== action.payload),
      };
    case 'LOAD_DATA':
      return action.payload;
    default:
      return state;
  }
}

export function TimeManagementProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(timeManagementReducer, initialState);

  useEffect(() => {
    const savedData = localStorage.getItem('timeManagementData');
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      dispatch({ type: 'LOAD_DATA', payload: parsedData });
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('timeManagementData', JSON.stringify(state));
  }, [state]);

  const addTimeEntry = (entry: Omit<TimeEntry, 'id'>) => {
    const newEntry: TimeEntry = {
      ...entry,
      id: crypto.randomUUID(),
    };
    dispatch({ type: 'ADD_TIME_ENTRY', payload: newEntry });
  };

  const updateTimeEntry = (entry: TimeEntry) => {
    dispatch({ type: 'UPDATE_TIME_ENTRY', payload: entry });
  };

  const deleteTimeEntry = (id: string) => {
    dispatch({ type: 'DELETE_TIME_ENTRY', payload: id });
  };

  const addCategory = (category: Omit<Category, 'id'>) => {
    const newCategory: Category = {
      ...category,
      id: crypto.randomUUID(),
    };
    dispatch({ type: 'ADD_CATEGORY', payload: newCategory });
  };

  const updateCategory = (category: Category) => {
    dispatch({ type: 'UPDATE_CATEGORY', payload: category });
  };

  const deleteCategory = (id: string) => {
    dispatch({ type: 'DELETE_CATEGORY', payload: id });
  };

  const value = {
    state,
    addTimeEntry,
    updateTimeEntry,
    deleteTimeEntry,
    addCategory,
    updateCategory,
    deleteCategory,
  };

  return <TimeManagementContext.Provider value={value}>{children}</TimeManagementContext.Provider>;
}

export function useTimeManagement() {
  const context = useContext(TimeManagementContext);
  if (context === undefined) {
    throw new Error('useTimeManagement must be used within a TimeManagementProvider');
  }
  return context;
}