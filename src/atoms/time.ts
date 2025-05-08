import { atom } from "jotai";

export interface TimeEntry {
  id: string;
  from: number;
  to: number;
  title: string;
  description: string;
  tags: string[];
}

export const timeEntries = atom<TimeEntry[]>([]);
