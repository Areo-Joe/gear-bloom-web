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

  // 使用一个ref来存储输入元素
  const durationInputRef = React.useRef<HTMLInputElement>(null);

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

  const renderInputSection = (
    id: string,
    label: string,
    value: string | number | null,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
    placeholder: string,
    inputType: string = "text",
    min?: number,
  ) => (
    <div className="space-y-2 w-full">
      <Label htmlFor={id} className="block text-center">
        {label}
      </Label>
      <Input
        id={id}
        value={value === null ? "" : value.toString()}
        onChange={onChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        type={inputType}
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
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
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
