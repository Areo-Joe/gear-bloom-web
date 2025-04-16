import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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
    if (value === "") {
      setDuration(null);
    } else {
      const numValue = parseInt(value, 10);
      if (!isNaN(numValue) && numValue >= 0) {
        setDuration(numValue);
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleNext();
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto space-y-4">
      {step === 1 && (
        <>
          <Label htmlFor="activity-input">你完成了什么事？</Label>
          <Input
            id="activity-input"
            value={activity}
            onChange={handleActivityChange}
            onKeyDown={handleKeyDown}
            placeholder="例如：学习 React, 修复 Bug..."
            autoFocus
          />
          <Button onClick={handleNext} disabled={activity.trim() === ""}>
            下一步
          </Button>
        </>
      )}

      {step === 2 && (
        <>
          <p className="text-sm text-muted-foreground">你完成了：{activity}</p>
          <Label htmlFor="duration-input">你在这件事上花了多少分钟？</Label>
          <Input
            id="duration-input"
            value={duration === null ? "" : duration.toString()}
            onChange={handleDurationChange}
            onKeyDown={handleKeyDown}
            placeholder="输入分钟数，例如 90"
            type="number"
            min={1}
            autoFocus
          />
          <Button
            onClick={handleNext}
            disabled={duration === null || duration <= 0}
          >
            完成
          </Button>
        </>
      )}

      {step === 3 && (
        <div className="p-4 border rounded-md bg-secondary text-secondary-foreground">
          <h3 className="font-semibold">记录完成！</h3>
          <p>事件: {activity}</p>
          <p>时长: {duration !== null ? `${duration} 分钟` : "未指定"}</p>
          <Button
            onClick={() => {
              setStep(1);
              setActivity("");
              setDuration(null);
            }}
            variant="outline"
            className="mt-4"
          >
            再记一笔
          </Button>
        </div>
      )}
    </div>
  );
}
