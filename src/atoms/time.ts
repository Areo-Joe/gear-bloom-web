import { atom } from "jotai";

interface TimeEntry {
  id: string;
  from: number;
  to: number;
  description: string;
  tags: string[];
}

export const timeEntries = atom<TimeEntry[]>([]);
