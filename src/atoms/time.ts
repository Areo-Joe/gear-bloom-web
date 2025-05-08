import { atom } from "jotai";

export interface TimeEntry {
  id: string;
  from: number;
  to: number;
  title: string;
  description: string;
  tags: string[];
}

// 创建示例开发数据
const now = Date.now();
const hour = 60 * 60 * 1000;
const day = 24 * hour;

const sampleEntries: TimeEntry[] = [
  {
    id: "dev-sample-1",
    title: "学习 React 新特性",
    description:
      "研究了 React 19 中的 React Compiler 和新的 Hooks API，尝试在项目中应用自动记忆化优化。",
    from: now - day - 2 * hour,
    to: now - day,
    tags: ["学习", "编程", "React"],
  },
  {
    id: "dev-sample-2",
    title: "晨跑锻炼",
    description: "沿着河边慢跑，完成了5公里的训练目标，感觉精神焕发。",
    from: now - 3 * hour,
    to: now - 3 * hour + 45 * 60 * 1000,
    tags: ["运动", "健康", "晨练"],
  },
];

// 仅在开发环境中使用示例数据
const isDev = import.meta.env.DEV;

// 初始化 atom
export const timeEntriesAtom = atom<TimeEntry[]>(isDev ? sampleEntries : []);
