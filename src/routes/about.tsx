import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/about")({
  component: About,
});

function About() {
  return (
    <div className="container max-w-4xl mx-auto p-6">
      <div className="space-y-8">
        {/* Simplified Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            关于 Gear Bloom
          </h1>
          <p className="text-muted-foreground text-lg">
            一个简洁、高效的时间管理应用
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Left Column */}
          <div className="space-y-6">
            {/* App Introduction Card */}
            <div className="group border rounded-xl p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                  <span className="text-blue-600 text-lg">📱</span>
                </div>
                <h2 className="text-xl font-semibold group-hover:text-blue-600 transition-colors duration-200">
                  应用简介
                </h2>
              </div>
              <div className="text-muted-foreground leading-relaxed space-y-3">
                <p>
                  Gear Bloom 是一款基于
                  <strong className="text-foreground">
                    柳比歇夫时间统计法
                  </strong>
                  的现代时间管理应用。
                  灵感来源于苏联昆虫学家亚历山大·柳比歇夫坚持56年的时间记录实践。
                </p>
                <p>
                  通过精确记录每项活动的时间投入，帮助你
                  <strong className="text-foreground">洞察时间流向</strong>，
                  发现效率盲区，逐步优化个人时间分配策略。
                </p>
                <p className="text-sm italic border-l-2 border-blue-500/30 pl-3">
                  &ldquo;时间是最稀缺的资源，除非善加管理，否则一事无成。&rdquo;
                  —— 彼得·德鲁克
                </p>
              </div>
            </div>

            {/* Features Card */}
            <div className="group border rounded-xl p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center">
                  <span className="text-green-600 text-lg">✨</span>
                </div>
                <h2 className="text-xl font-semibold group-hover:text-green-600 transition-colors duration-200">
                  主要功能
                </h2>
              </div>
              <ul className="space-y-3 text-muted-foreground">
                {[
                  "快速记录活动时间",
                  "自定义标签分类",
                  "详细的活动描述",
                  "响应式设计",
                ].map((feature, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Tech Stack Card */}
            <div className="group border rounded-xl p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center">
                  <span className="text-purple-600 text-lg">🛠️</span>
                </div>
                <h2 className="text-xl font-semibold group-hover:text-purple-600 transition-colors duration-200">
                  技术栈
                </h2>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  {
                    name: "React",
                    color:
                      "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
                  },
                  {
                    name: "TypeScript",
                    color:
                      "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
                  },
                  {
                    name: "TanStack Router",
                    color:
                      "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
                  },
                  {
                    name: "shadcn/ui",
                    color:
                      "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-300",
                  },
                  {
                    name: "Tailwind CSS",
                    color:
                      "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300",
                  },
                  {
                    name: "Jotai",
                    color:
                      "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300",
                  },
                ].map((tech) => (
                  <div
                    key={tech.name}
                    className={`${tech.color} rounded-lg p-3 text-center transition-transform duration-200 hover:scale-105 cursor-pointer`}
                  >
                    <span className="text-sm font-medium">{tech.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Version Info Card */}
            <div className="group border rounded-xl p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-yellow-500/10 flex items-center justify-center">
                  <span className="text-yellow-600 text-lg">📊</span>
                </div>
                <h2 className="text-xl font-semibold group-hover:text-yellow-600 transition-colors duration-200">
                  版本信息
                </h2>
              </div>
              <div className="space-y-3 text-sm text-muted-foreground">
                {[
                  { label: "版本", value: "1.0.0" },
                  { label: "构建时间", value: new Date().toLocaleDateString() },
                  { label: "状态", value: "开发中", isStatus: true },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="flex justify-between items-center"
                  >
                    <span>{item.label}</span>
                    <span
                      className={`font-medium ${item.isStatus ? "text-green-600" : ""}`}
                    >
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
