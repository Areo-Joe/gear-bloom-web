import * as React from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/list")({
  component: List,
});

function List() {
  const navigate = useNavigate();

  const goToInputPage = () => {
    navigate({ to: "/" });
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-sm p-6 border rounded-lg shadow-md bg-card text-card-foreground text-center">
        <div className="flex justify-end mb-4">
          <Button
            variant="outline"
            size="sm"
            onClick={goToInputPage}
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

        <h2 className="text-xl font-bold mb-6">活动列表</h2>
        <p className="text-muted-foreground mb-4">暂无记录</p>

        <div className="h-40 flex items-center justify-center border-2 border-dashed border-muted-foreground/20 rounded-lg">
          <p className="text-muted-foreground text-sm">
            点击右上角按钮添加新记录
          </p>
        </div>
      </div>
    </div>
  );
}
