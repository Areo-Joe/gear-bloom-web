import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useAtom } from "jotai";
import { timeEntriesAtom } from "../atoms/time";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { CartesianGrid, XAxis, YAxis, LineChart, Line } from "recharts";

export const Route = createFileRoute("/stats")({
  component: Stats,
});

// 计算时长（分钟）
const getDurationMinutes = (from: number, to: number): number => {
  return Math.round((to - from) / 1000 / 60);
};

// 获取日期字符串 (YYYY-MM-DD)
const getDateString = (timestamp: number): string => {
  return new Date(timestamp)
    .toLocaleDateString("zh-CN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    })
    .replace(/\//g, "-");
};

// 获取星期几
const getWeekday = (timestamp: number): string => {
  const weekdays = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
  return weekdays[new Date(timestamp).getDay()];
};

function Stats() {
  const [timeEntries] = useAtom(timeEntriesAtom);

  // 按日期统计
  const dailyStats = React.useMemo(() => {
    const dateMap = new Map<string, number>();

    timeEntries.forEach((entry) => {
      const date = getDateString(entry.from);
      const duration = getDurationMinutes(entry.from, entry.to);
      dateMap.set(date, (dateMap.get(date) || 0) + duration);
    });

    const result = Array.from(dateMap.entries())
      .map(([date, minutes]) => ({
        date,
        minutes,
        hours: +(minutes / 60).toFixed(1),
        weekday: getWeekday(new Date(date).getTime()),
      }))
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(-7); // 最近7天

    return result;
  }, [timeEntries]);

  // Chart config
  const dailyChartConfig = {
    hours: {
      label: "时长（小时）",
      color: "hsl(var(--chart-2))",
    },
  } satisfies ChartConfig;

  // 如果没有数据，显示空状态
  if (timeEntries.length === 0) {
    return (
      <div className="container max-w-6xl mx-auto p-6">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">数据统计</h1>
            <p className="text-muted-foreground">分析你的时间投入情况</p>
          </div>

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
                <path d="M3 3v5h5" />
                <path d="M3 8a9 9 0 0 1 9-9 9.9 9.9 0 0 1 3.8 1" />
                <path d="M21 3A9 9 0 0 1 12 21a9.9 9.9 0 0 1-3.8-1" />
              </svg>
              <p className="text-muted-foreground text-lg mb-2">暂无统计数据</p>
              <p className="text-muted-foreground/80 text-sm">
                开始记录活动后就能看到详细的统计分析了
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl mx-auto p-6">
      <div className="space-y-6">
        {/* 页面标题 */}
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight">数据统计</h1>
          <p className="text-muted-foreground">分析你的时间投入情况</p>
        </div>

        {/* 最近7天趋势 */}
        <div className="flex justify-center">
          <Card className="w-full max-w-3xl">
            <CardHeader>
              <CardTitle>最近7天趋势</CardTitle>
              <CardDescription>每日时间投入变化</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={dailyChartConfig}
                className="min-h-[300px] w-full"
              >
                <LineChart
                  accessibilityLayer
                  data={dailyStats}
                  margin={{
                    left: 12,
                    right: 12,
                  }}
                >
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="date"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tickFormatter={(value) => {
                      const date = new Date(value);
                      return `${date.getMonth() + 1}/${date.getDate()}`;
                    }}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tickFormatter={(value) => `${value}h`}
                  />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent hideIndicator />}
                    labelFormatter={(value) => {
                      const date = new Date(value);
                      return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
                    }}
                  />
                  <Line
                    dataKey="hours"
                    type="monotone"
                    stroke="var(--color-hours)"
                    strokeWidth={2}
                    dot={{
                      fill: "var(--color-hours)",
                    }}
                    activeDot={{
                      r: 6,
                    }}
                  />
                </LineChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
