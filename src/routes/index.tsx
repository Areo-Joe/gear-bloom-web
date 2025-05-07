import * as React from "react";
import { useState, useEffect } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Steps } from "../components/ui/steps";

// Icons
const ListIcon = () => (
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
);

// Utility functions
const formatDateTime = (date: Date): string => {
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

const getEffortPhrase = (mins: number): string => {
  if (mins <= 10) return "短暂但有价值的时间";
  if (mins <= 30) return "高效的专注时间";
  if (mins <= 60) return "令人印象深刻的专注";
  if (mins <= 120) return "出色的持久专注";
  return "令人惊叹的持续努力";
};

// Types
interface FormData {
  activity: string;
  duration: number | null;
  completionTime: Date | null;
  description: string;
  tags: string[];
}

// Step Components
const ActivityStep = ({
  activity,
  setActivity,
  onNext,
}: {
  activity: string;
  setActivity: (value: string) => void;
  onNext: () => void;
}) => {
  const handleActivityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setActivity(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      onNext();
    }
  };

  return (
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
        onClick={onNext}
        disabled={activity.trim() === ""}
        className="w-full mt-4"
      >
        下一步
      </Button>
    </div>
  );
};

const DurationStep = ({
  activity,
  duration,
  setDuration,
  onNext,
}: {
  activity: string;
  duration: number | null;
  setDuration: (value: number | null) => void;
  onNext: () => void;
}) => {
  const handleDurationInput = (e: React.FormEvent<HTMLInputElement>) => {
    const input = e.target as HTMLInputElement;
    const numericValue = input.value.replace(/\D/g, "");

    if (input.value !== numericValue) {
      input.value = numericValue;
    }

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
      onNext();
    }
  };

  return (
    <div className="space-y-4 flex flex-col items-center">
      <p className="text-sm text-center text-muted-foreground mb-2">
        任务: <span className="font-medium text-foreground">{activity}</span>
      </p>
      <div className="space-y-2 w-full">
        <Label htmlFor="duration-input" className="block text-center">
          你在这件事上花了多少分钟？
        </Label>
        <Input
          id="duration-input"
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
        onClick={onNext}
        disabled={duration === null || duration <= 0}
        className="w-full mt-4"
      >
        完成记录
      </Button>
    </div>
  );
};

const CompletionStep = ({
  formData,
  onReset,
  updateFormField,
}: {
  formData: FormData;
  onReset: () => void;
  updateFormField: <K extends keyof FormData>(
    field: K,
    value: FormData[K],
  ) => void;
}) => {
  const { activity, duration, completionTime, description, tags } = formData;
  const [customTag, setCustomTag] = useState("");

  // Default tag options
  const defaultTags = ["工作", "学习", "运动", "阅读", "休息", "娱乐"];

  const calculateTimeRange = (): { start: string; end: string } | null => {
    if (!completionTime || duration === null) return null;

    const end = completionTime;
    const start = new Date(end.getTime() - duration * 60 * 1000);

    return {
      start: formatDateTime(start),
      end: formatDateTime(end),
    };
  };

  const timeRange = calculateTimeRange();

  const handleDescriptionChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    updateFormField("description", e.target.value);
  };

  const toggleTag = (tag: string) => {
    const newTags = tags.includes(tag)
      ? tags.filter((t) => t !== tag)
      : [...tags, tag];
    updateFormField("tags", newTags);
  };

  const addCustomTag = () => {
    if (customTag.trim() && !tags.includes(customTag.trim())) {
      updateFormField("tags", [...tags, customTag.trim()]);
      setCustomTag("");
    }
  };

  const handleCustomTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && customTag.trim()) {
      e.preventDefault();
      addCustomTag();
    }
  };

  return (
    <div className="space-y-5">
      <div className="p-4 border rounded-lg bg-gradient-to-b from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 text-green-800 dark:text-green-200 space-y-3 text-center">
        <div className="flex justify-center mb-2">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-100 to-green-200 dark:from-green-800/30 dark:to-green-700/40 flex items-center justify-center text-2xl shadow-inner">
            ✓
          </div>
        </div>

        <h3 className="text-lg font-semibold text-green-900 dark:text-green-100">
          你太给力了！
        </h3>
        <p className="text-sm text-green-700 dark:text-green-300 max-w-xs mx-auto">
          你刚刚完成了 <span className="font-medium">{activity}</span> 的工作，
          {duration && (
            <span>
              {" "}
              投入了 {duration} 分钟的{getEffortPhrase(duration)}
            </span>
          )}
          。
        </p>

        {timeRange && (
          <div className="bg-white/60 dark:bg-black/20 p-2 rounded-lg shadow-sm">
            <div className="flex items-center justify-center space-x-3 text-sm">
              <span>{timeRange.start}</span>
              <div className="h-0.5 w-6 bg-green-300 dark:bg-green-700"></div>
              <span>{timeRange.end}</span>
            </div>
          </div>
        )}
      </div>

      <div className="space-y-4 mt-4">
        <div>
          <Label
            htmlFor="description"
            className="block text-sm font-medium mb-2"
          >
            为你的活动添加描述
          </Label>
          <textarea
            id="description"
            value={description}
            onChange={handleDescriptionChange}
            placeholder="详细描述一下你完成的活动..."
            className="w-full p-2 min-h-[80px] text-sm rounded-md border border-input bg-background"
          />
        </div>

        <div>
          <Label className="block text-sm font-medium mb-2">添加标签</Label>
          <div className="flex flex-wrap gap-2 mb-3">
            {defaultTags.map((tag) => (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className={`px-3 py-1 text-xs rounded-full ${
                  tags.includes(tag)
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>

          <div className="flex gap-2">
            <Input
              value={customTag}
              onChange={(e) => setCustomTag(e.target.value)}
              onKeyDown={handleCustomTagKeyDown}
              placeholder="添加自定义标签..."
              className="flex-1"
            />
            <Button
              onClick={addCustomTag}
              size="sm"
              variant="outline"
              disabled={!customTag.trim()}
            >
              添加
            </Button>
          </div>

          {tags.length > 0 && (
            <div className="mt-3">
              <p className="text-xs text-muted-foreground mb-1">已选标签:</p>
              <div className="flex flex-wrap gap-1">
                {tags.map((tag) => (
                  <div
                    key={tag}
                    className="flex items-center bg-primary/10 text-primary px-2 py-1 rounded text-xs"
                  >
                    {tag}
                    <button
                      onClick={() => toggleTag(tag)}
                      className="ml-1 hover:text-destructive"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex gap-2 mt-6">
        <Button onClick={onReset} variant="outline" className="flex-1">
          记录下一项
        </Button>
        <Button className="flex-1" onClick={onReset}>
          保存记录
        </Button>
      </div>
    </div>
  );
};

// Main Container
const ActivityTracker = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    activity: "",
    duration: null,
    completionTime: null,
    description: "",
    tags: [],
  });

  // Record completion time when reaching step 3
  useEffect(() => {
    if (step === 3) {
      setFormData((prev) => ({ ...prev, completionTime: new Date() }));
    }
  }, [step]);

  const handleNext = () => {
    if (step === 1 && formData.activity.trim() !== "") {
      setStep(2);
    } else if (
      step === 2 &&
      formData.duration !== null &&
      formData.duration > 0
    ) {
      setStep(3);
    }
  };

  const resetForm = () => {
    setStep(1);
    setFormData({
      activity: "",
      duration: null,
      completionTime: null,
      description: "",
      tags: [],
    });
  };

  const goToListPage = () => {
    navigate({ to: "/list" });
  };

  const updateFormField = <K extends keyof FormData>(
    field: K,
    value: FormData[K],
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
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
            <ListIcon />
            查看记录
          </Button>
        </div>

        <Steps currentStep={step} totalSteps={3} className="mb-6" />

        <div className="text-center mb-6">
          <h2 className="text-xl font-bold">
            {step === 1 && "记录新事项"}
            {step === 2 && "记录时间"}
            {step === 3 && "完善记录"}
          </h2>
        </div>

        {step === 1 && (
          <ActivityStep
            activity={formData.activity}
            setActivity={(value) => updateFormField("activity", value)}
            onNext={handleNext}
          />
        )}

        {step === 2 && (
          <DurationStep
            activity={formData.activity}
            duration={formData.duration}
            setDuration={(value) => updateFormField("duration", value)}
            onNext={handleNext}
          />
        )}

        {step === 3 && (
          <CompletionStep
            formData={formData}
            onReset={resetForm}
            updateFormField={updateFormField}
          />
        )}
      </div>
    </div>
  );
};

export const Route = createFileRoute("/")({
  component: ActivityTracker,
});
