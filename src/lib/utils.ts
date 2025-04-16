import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * 合并 className 字符串的工具函数
 * 使用 clsx 处理条件类名，然后用 tailwind-merge 合并 tailwind 类，解决冲突
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
