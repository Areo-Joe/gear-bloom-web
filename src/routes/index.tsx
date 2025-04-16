import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Steps } from "../components/ui/steps";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const [step, setStep] = React.useState(1);
  const [activity, setActivity] = React.useState("");
  const [duration, setDuration] = React.useState<number | null>(null);

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

  const handleDurationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    // 如果输入为空，设置为 null
    if (value === "") {
      setDuration(null);
      return;
    }

    // 只处理纯数字输入
    if (/^\d+$/.test(value)) {
      const numValue = parseInt(value, 10);
      if (numValue >= 0) {
        setDuration(numValue);
      }
    }
    // 如果输入的不是纯数字，我们不更新状态，保持原来的值
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleNext();
    }
  };

  // 专门用于处理 duration 输入框的按键事件
  const handleDurationKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // 允许: 数字键 (0-9), Backspace, Delete, Tab, Escape, Enter, 方向键
    const allowedKeys = [
      "0",
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "Backspace",
      "Delete",
      "Tab",
      "Escape",
      "Enter",
      "ArrowLeft",
      "ArrowRight",
      "ArrowUp",
      "ArrowDown",
      "Home",
      "End",
    ];

    // 如果按下的键不在允许列表中，且不是功能键组合 (如 Ctrl+A, Ctrl+C)
    if (!allowedKeys.includes(e.key) && !(e.ctrlKey || e.metaKey)) {
      e.preventDefault(); // 阻止默认行为
    }

    // 如果是 Enter 键，执行 handleNext 逻辑
    if (e.key === "Enter") {
      e.preventDefault();
      handleNext();
    }
  };

  const renderInputSection = (
    id: string,
    label: string,
    value: string | number | null,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
    placeholder: string,
    inputType: string = "text",
    min?: number,
    isDurationInput: boolean = false, // 新增参数，标识是否为 duration 输入框
  ) => (
    <div className="space-y-2 w-full">
      <Label htmlFor={id} className="block text-center">
        {label}
      </Label>
      <Input
        id={id}
        value={value === null ? "" : value.toString()}
        onChange={onChange}
        onKeyDown={isDurationInput ? handleDurationKeyDown : handleKeyDown} // 根据输入类型选择不同的按键处理函数
        placeholder={placeholder}
        type={inputType} // 对于 duration 我们保留 number 类型，但增加键盘过滤
        min={min}
        autoFocus
        className="w-full"
      />
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-sm p-6 border rounded-lg shadow-md bg-card text-card-foreground">
        {/* 使用提取的 Steps 组件 */}
        <Steps currentStep={step} totalSteps={3} className="mb-6" />

        <div className="text-center mb-6">
          <h2 className="text-xl font-bold">
            {step === 1 && "记录新事项"}
            {step === 2 && "记录时间"}
            {step === 3 && "完成记录"}
          </h2>
        </div>

        {step === 1 && (
          <div className="space-y-4 flex flex-col items-center">
            {renderInputSection(
              "activity-input",
              "你完成了什么事？",
              activity,
              handleActivityChange,
              "例如：学习 React, 修复 Bug...",
            )}
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
            {renderInputSection(
              "duration-input",
              "你在这件事上花了多少分钟？",
              duration,
              handleDurationChange,
              "输入分钟数，例如 90",
              "number",
              1,
              true,
            )}
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
          <div className="p-6 border rounded-lg bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200 space-y-4 text-center">
            <div className="flex justify-center mb-2">
              <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-800/30 flex items-center justify-center text-2xl">
                ✓
              </div>
            </div>
            <h3 className="text-lg font-semibold text-green-900 dark:text-green-100">
              记录完成！
            </h3>
            <div className="space-y-2">
              <p className="font-medium">事件:</p>
              <p className="text-green-700 dark:text-green-300">{activity}</p>
            </div>
            <div className="space-y-2">
              <p className="font-medium">时长:</p>
              <p className="text-green-700 dark:text-green-300">
                {duration !== null ? `${duration} 分钟` : "未指定"}
              </p>
            </div>
            <Button
              onClick={() => {
                setStep(1);
                setActivity("");
                setDuration(null);
              }}
              variant="outline"
              className="w-full mt-6 border-green-300 dark:border-green-700 text-green-800 dark:text-green-200 hover:bg-green-100 dark:hover:bg-green-900/30"
            >
              再记一笔
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
