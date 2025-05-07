import * as React from "react";
import { useState, useRef, useEffect } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Steps } from "../components/ui/steps";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [activity, setActivity] = useState("");
  const [duration, setDuration] = useState<number | null>(null);
  // 存储完成时的时间点
  const [completionTime, setCompletionTime] = useState<Date | null>(null);

  // 使用一个ref来存储输入元素
  const durationInputRef = useRef<HTMLInputElement>(null);

  // 当步骤变为3（完成步骤）时，记录当前时间
  useEffect(() => {
    if (step === 3) {
      setCompletionTime(new Date());
    }
  }, [step]);

  const handleNext = () => {
    if (step === 1 && activity.trim() !== "") {
      setStep(2);
    } else if (step === 2 && duration !== null && duration > 0) {
      console.log("Activity:", activity, "Duration (minutes):", duration);
      setStep(3);
    }
  };

  const handleActivityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setActivity(e.target.value);
  };

  // 处理时长输入的变更，使用输入事件而不是变更事件
  const handleDurationInput = (e: React.FormEvent<HTMLInputElement>) => {
    const input = e.target as HTMLInputElement;

    // 移除所有非数字字符
    const numericValue = input.value.replace(/\D/g, "");

    // 如果用户输入了非数字字符，立即更正输入框的值
    if (input.value !== numericValue) {
      input.value = numericValue;
    }

    // 更新状态
    if (numericValue === "") {
      setDuration(null);
    } else {
      const num = parseInt(numericValue, 10);
      setDuration(num);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleNext();
    }
  };

  // 格式化日期时间的辅助函数
  const formatDateTime = (date: Date): string => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  // 计算时间范围
  const calculateTimeRange = (): { start: string; end: string } | null => {
    if (!completionTime || duration === null) return null;

    const end = completionTime;
    const start = new Date(end.getTime() - duration * 60 * 1000);

    return {
      start: formatDateTime(start),
      end: formatDateTime(end),
    };
  };

  // 获取时间范围文本
  const timeRange = calculateTimeRange();

  // 获取一个表示努力程度的鼓励词
  const getEffortPhrase = (mins: number): string => {
    if (mins <= 10) return "短暂但有价值的时间";
    if (mins <= 30) return "高效的专注时间";
    if (mins <= 60) return "令人印象深刻的专注";
    if (mins <= 120) return "出色的持久专注";
    return "令人惊叹的持续努力";
  };

  const goToListPage = () => {
    navigate({ to: "/list" });
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-sm p-6 border rounded-lg shadow-md bg-card text-card-foreground">
        <div className="flex justify-end mb-4">
          <Button
            variant="outline"
            size="sm"
            onClick={goToListPage}
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
              className="lucide lucide-list"
            >
              <line x1="8" x2="21" y1="6" y2="6" />
              <line x1="8" x2="21" y1="12" y2="12" />
              <line x1="8" x2="21" y1="18" y2="18" />
              <line x1="3" x2="3.01" y1="6" y2="6" />
              <line x1="3" x2="3.01" y1="12" y2="12" />
              <line x1="3" x2="3.01" y1="18" y2="18" />
            </svg>
            查看记录
          </Button>
        </div>

        <Steps currentStep={step} totalSteps={3} className="mb-6" />

        <div className="text-center mb-6">
          <h2 className="text-xl font-bold">
            {step === 1 && "记录新事项"}
            {step === 2 && "记录时间"}
            {step === 3 && "太棒了！"}
          </h2>
        </div>

        {step === 1 && (
          <div className="space-y-4 flex flex-col items-center">
            <div className="space-y-2 w-full">
              <Label htmlFor="activity-input" className="block text-center">
                你完成了什么事？
              </Label>
              <Input
                id="activity-input"
                value={activity}
                onChange={handleActivityChange}
                onKeyDown={handleKeyDown}
                placeholder="例如：学习 React, 修复 Bug..."
                autoFocus
                className="w-full"
              />
            </div>
            <Button
              onClick={handleNext}
              disabled={activity.trim() === ""}
              className="w-full mt-4"
            >
              下一步
            </Button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4 flex flex-col items-center">
            <p className="text-sm text-center text-muted-foreground mb-2">
              任务:{" "}
              <span className="font-medium text-foreground">{activity}</span>
            </p>
            <div className="space-y-2 w-full">
              <Label htmlFor="duration-input" className="block text-center">
                你在这件事上花了多少分钟？
              </Label>
              <Input
                id="duration-input"
                ref={durationInputRef}
                defaultValue={duration === null ? "" : duration.toString()}
                onInput={handleDurationInput}
                onKeyDown={handleKeyDown}
                placeholder="输入分钟数，例如 90"
                type="text" // 使用text而不是number类型
                inputMode="numeric" // 在移动设备上显示数字键盘
                pattern="[0-9]*" // HTML5验证模式
                min={1}
                autoFocus
                className="w-full"
              />
            </div>
            <Button
              onClick={handleNext}
              disabled={duration === null || duration <= 0}
              className="w-full mt-4"
            >
              完成记录
            </Button>
          </div>
        )}

        {step === 3 && (
          <div className="p-6 border rounded-lg bg-gradient-to-b from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 text-green-800 dark:text-green-200 space-y-5 text-center">
            <div className="flex justify-center mb-3">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-100 to-green-200 dark:from-green-800/30 dark:to-green-700/40 flex items-center justify-center text-3xl shadow-inner">
                ✓
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-green-900 dark:text-green-100 mb-2">
                你太给力了！
              </h3>
              <p className="text-sm text-green-700 dark:text-green-300 max-w-xs mx-auto">
                你刚刚完成了 <span className="font-medium">{activity}</span>{" "}
                的工作，
                {duration && (
                  <span>
                    {" "}
                    投入了 {duration} 分钟的{getEffortPhrase(duration)}
                  </span>
                )}
                。
              </p>
            </div>

            {timeRange && (
              <div className="bg-white/60 dark:bg-black/20 p-3 rounded-lg shadow-sm">
                <div className="flex items-center justify-center space-x-3 text-base">
                  <span>{timeRange.start}</span>
                  <div className="h-0.5 w-6 bg-green-300 dark:bg-green-700"></div>
                  <span>{timeRange.end}</span>
                </div>
              </div>
            )}

            <Button
              onClick={() => {
                setStep(1);
                setActivity("");
                setDuration(null);
                setCompletionTime(null);
              }}
              variant="outline"
              className="w-full mt-6 border-green-300 dark:border-green-700 text-green-800 dark:text-green-200 hover:bg-green-100 dark:hover:bg-green-900/30"
            >
              记录下一项
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
