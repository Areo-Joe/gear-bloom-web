import { atomWithStorage } from "jotai/utils";

export interface TimeEntry {
  id: string;
  from: number;
  to: number;
  title: string;
  description: string;
  tags: string[];
}

// 初始化 atom
export const timeEntriesAtom = atomWithStorage<TimeEntry[]>(
  "gear-bloom-time-entries",
  [],
);
