import * as React from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
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

  const [timeEntries, setTimeEntries] = useAtom(timeEntriesAtom);
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [entryToDelete, setEntryToDelete] = React.useState<{
    id: string;
    title: string;
  } | null>(null);

  // 打开删除确认对话框
  const openDeleteDialog = (id: string, title: string) => {
    setEntryToDelete({ id, title });
    setDeleteDialogOpen(true);
  };

  // 执行删除
  const confirmDelete = () => {
    if (entryToDelete) {
      setTimeEntries((prev) =>
        prev.filter((entry) => entry.id !== entryToDelete.id),
      );
      setDeleteDialogOpen(false);
      setEntryToDelete(null);
    }
  };

  return (
    <div className="container max-w-4xl mx-auto p-6">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">活动列表</h1>
            <p className="text-muted-foreground">查看你的所有时间记录</p>
          </div>
          <Button
            variant="outline"
            onClick={toHome}
            className="flex items-center gap-2"
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
              className="lucide lucide-plus"
            >
              <path d="M5 12h14" />
              <path d="M12 5v14" />
            </svg>
            记录新活动
          </Button>
        </div>

        {timeEntries.length === 0 ? (
          <div className="text-center py-12">
            <div className="h-48 flex flex-col items-center justify-center border-2 border-dashed border-muted-foreground/20 rounded-lg">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-muted-foreground/40 mb-4"
              >
                <path d="M6 2v6h6" />
                <path d="M21 13a9 9 0 1 1-3-7.7L21 8" />
              </svg>
              <p className="text-muted-foreground text-lg mb-2">暂无记录</p>
              <p className="text-muted-foreground/80 text-sm">
                点击右上角按钮开始记录你的第一个活动
              </p>
            </div>
          </div>
        ) : (
          <div className="grid gap-4">
            {timeEntries.map((entry) => (
              <div
                key={entry.id}
                className="p-6 border rounded-lg hover:shadow-md transition-shadow bg-card relative"
              >
                {/* 删除按钮 - 垂直居中在右侧 */}
                <div className="absolute top-4 right-4">
                  <AlertDialog
                    open={deleteDialogOpen}
                    onOpenChange={setDeleteDialogOpen}
                  >
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openDeleteDialog(entry.id, entry.title)}
                        className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                        title="删除记录"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M3 6h18" />
                          <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                          <path d="M8 6V4c0-1 1-2 2-2h4c-1 0 2 1 2 2v2" />
                        </svg>
                      </Button>
                    </AlertDialogTrigger>
                  </AlertDialog>
                </div>

                <div className="pr-12">
                  <div className="mb-3">
                    <h3 className="font-semibold text-lg mb-1">
                      {entry.title}
                    </h3>
                    <span className="text-sm text-muted-foreground">
                      {formatDate(entry.from)}
                    </span>
                  </div>

                  <div className="flex items-center text-sm text-muted-foreground mb-4">
                    <div className="flex items-center space-x-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="14"
                        height="14"
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
                      <span className="bg-secondary px-2 py-1 rounded-md text-xs ml-2">
                        {getDurationText(entry.from, entry.to)}
                      </span>
                    </div>
                  </div>

                  {entry.description && (
                    <p className="text-sm mb-4 text-foreground/80">
                      {entry.description}
                    </p>
                  )}

                  {entry.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {entry.tags.map((tag) => (
                        <span
                          key={tag}
                          className={`text-xs px-2 py-1 rounded-full ${getTagColor(tag)}`}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 删除确认对话框 */}
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>确认删除</AlertDialogTitle>
              <AlertDialogDescription>
                确定要删除活动&ldquo;{entryToDelete?.title}
                &rdquo;吗？此操作无法撤销。
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>取消</AlertDialogCancel>
              <AlertDialogAction
                onClick={confirmDelete}
                className="bg-destructive text-white hover:bg-destructive/90"
              >
                删除
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
