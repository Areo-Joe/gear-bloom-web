import * as React from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { timeEntriesAtom } from "../atoms/time";
import { useAtom } from "jotai";

// 格式化时间戳为 HH:MM 格式
const formatTime = (timestamp: number): string => {
  const date = new Date(timestamp);
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

// 格式化日期
const formatDate = (timestamp: number): string => {
  const date = new Date(timestamp);
  return date.toLocaleDateString([], {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

// 计算时长文本
const getDurationText = (from: number, to: number): string => {
  const minutes = Math.round((to - from) / 1000 / 60);

  if (minutes < 60) {
    return `${minutes} 分钟`;
  } else {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0
      ? `${hours} 小时 ${remainingMinutes} 分钟`
      : `${hours} 小时`;
  }
};

// 获取标签颜色
const getTagColor = (tag: string): string => {
  // 为固定标签设置颜色
  const tagColors: Record<string, string> = {
    工作: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
    学习: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
    运动: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
    阅读: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
    休息: "bg-sky-100 text-sky-800 dark:bg-sky-900/30 dark:text-sky-300",
    娱乐: "bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300",
  };

  return (
    tagColors[tag] ||
    "bg-gray-100 text-gray-800 dark:bg-gray-800/50 dark:text-gray-300"
  );
};

export const Route = createFileRoute("/list")({
  component: List,
});

function useToHome() {
  const navigate = useNavigate();
  return () => navigate({ to: "/" });
}

function List() {
  const toHome = useToHome();

  const [timeEntries] = useAtom(timeEntriesAtom);

  console.log("get time entries", timeEntries);

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md p-6 border rounded-lg shadow-md bg-card text-card-foreground">
        <div className="flex justify-end mb-4">
          <Button
            variant="outline"
            size="sm"
            onClick={toHome}
            className="flex items-center gap-1"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-pencil-line"
            >
              <path d="M12 20h9"></path>
              <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
            </svg>
            记录活动
          </Button>
        </div>

        <h2 className="text-xl font-bold mb-6 text-center">活动列表</h2>
        {timeEntries.length === 0 ? (
          <div className="text-center">
            <p className="text-muted-foreground mb-4">暂无记录</p>
            <div className="h-40 flex items-center justify-center border-2 border-dashed border-muted-foreground/20 rounded-lg">
              <p className="text-muted-foreground text-sm">
                点击右上角按钮添加新记录
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
            {timeEntries.map((entry) => (
              <div
                key={entry.id}
                className="p-4 border rounded-lg hover:shadow-md transition-shadow bg-background/50"
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium text-base">{entry.title}</h3>
                  <span className="text-xs text-muted-foreground">
                    {formatDate(entry.from)}
                  </span>
                </div>

                <div className="flex items-center text-xs text-muted-foreground mb-3">
                  <div className="flex items-center space-x-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mr-1"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                    {formatTime(entry.from)} - {formatTime(entry.to)}
                    <span className="bg-secondary/50 px-1.5 py-0.5 rounded-md text-[10px] ml-1">
                      {getDurationText(entry.from, entry.to)}
                    </span>
                  </div>
                </div>

                {entry.description && (
                  <p className="text-sm mb-3 text-foreground/80 line-clamp-2">
                    {entry.description}
                  </p>
                )}

                {entry.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {entry.tags.map((tag) => (
                      <span
                        key={tag}
                        className={`text-xs px-2 py-0.5 rounded-full ${getTagColor(tag)}`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
