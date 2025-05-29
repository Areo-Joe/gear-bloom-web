import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/about")({
  component: About,
});

function About() {
  return (
    <div className="container max-w-4xl mx-auto p-6">
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">关于 Gear Bloom</h1>
          <p className="text-muted-foreground">一个简洁、高效的时间管理应用</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-4">
            <div className="border rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-3">应用简介</h2>
              <p className="text-muted-foreground">
                Gear Bloom 是一个专注于时间记录的 Web 应用。通过简单直观的界面，
                帮助用户记录和管理自己的时间分配，提高工作效率。
              </p>
            </div>

            <div className="border rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-3">主要功能</h2>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-center gap-2">
                  <span className="w-1 h-1 bg-primary rounded-full"></span>
                  快速记录活动时间
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1 h-1 bg-primary rounded-full"></span>
                  自定义标签分类
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1 h-1 bg-primary rounded-full"></span>
                  详细的活动描述
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1 h-1 bg-primary rounded-full"></span>
                  响应式设计
                </li>
              </ul>
            </div>
          </div>

          <div className="space-y-4">
            <div className="border rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-3">技术栈</h2>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-secondary/50 rounded-lg p-3 text-center">
                  <span className="text-sm font-medium">React</span>
                </div>
                <div className="bg-secondary/50 rounded-lg p-3 text-center">
                  <span className="text-sm font-medium">TypeScript</span>
                </div>
                <div className="bg-secondary/50 rounded-lg p-3 text-center">
                  <span className="text-sm font-medium">TanStack Router</span>
                </div>
                <div className="bg-secondary/50 rounded-lg p-3 text-center">
                  <span className="text-sm font-medium">shadcn/ui</span>
                </div>
                <div className="bg-secondary/50 rounded-lg p-3 text-center">
                  <span className="text-sm font-medium">Tailwind CSS</span>
                </div>
                <div className="bg-secondary/50 rounded-lg p-3 text-center">
                  <span className="text-sm font-medium">Jotai</span>
                </div>
              </div>
            </div>

            <div className="border rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-3">版本信息</h2>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex justify-between">
                  <span>版本</span>
                  <span>1.0.0</span>
                </div>
                <div className="flex justify-between">
                  <span>构建时间</span>
                  <span>{new Date().toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>状态</span>
                  <span className="text-green-600">开发中</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
