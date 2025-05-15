import * as React from "react";
import { useState, useCallback } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Steps } from "../components/ui/steps";
import { toast, Toaster } from "sonner";
import { timeEntriesAtom } from "../atoms/time";
import { useAtom } from "jotai";

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

interface ITitleStep {
  title: string;
  setTitle: (value: string) => void;
  onNext: () => void;
}

// Step Components
const TitleStep = ({ title, setTitle, onNext }: ITitleStep) => {
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
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
          value={title}
          onChange={handleTitleChange}
          onKeyDown={handleKeyDown}
          placeholder="例如：学习 React, 修复 Bug..."
          autoFocus
          className="w-full"
        />
      </div>
      <Button
        onClick={onNext}
        disabled={title.trim() === ""}
        className="w-full mt-4"
      >
        下一步
      </Button>
    </div>
  );
};

interface IDurationStep {
  title: string;
  onNext: (duration: { from: number; to: number }) => void;
  onPrev: () => void;
}

const DurationStep = ({ title, onNext, onPrev }: IDurationStep) => {
  const [time, setTime] = useState<null | number>(null);

  const handleDurationInput = (e: React.FormEvent<HTMLInputElement>) => {
    const value = (e.target as HTMLInputElement).value;
    if (typeof value !== "string") {
      setTime(null);
      return;
    }

    const numericValue = value.replace(/\D/g, "").trim();
    setTime(numericValue === "" ? null : parseInt(numericValue));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Prevent e, +, -, and other non-numeric characters
    if (e.key === "e") {
      e.preventDefault();
      return;
    }

    if (e.key === "Enter") {
      e.preventDefault();
      handleNext();
    }
  };

  const handleNext = () => {
    if (time === null || time <= 0) {
      return;
    }

    const to = new Date().getTime();
    const from = to - time * 60 * 1000;

    // Important: Set the duration first, then call onNext in the next render cycle
    onNext({ from, to });
  };

  return (
    <div className="space-y-4 flex flex-col items-center">
      <p className="text-sm text-center text-muted-foreground mb-2">
        任务: <span className="font-medium text-foreground">{title}</span>
      </p>
      <div className="space-y-2 w-full">
        <Label htmlFor="duration-input" className="block text-center">
          你在这件事上花了多少分钟？
        </Label>
        <Input
          id="duration-input"
          value={time === null ? "" : `${time}`}
          onInput={handleDurationInput}
          onKeyDown={handleKeyDown}
          placeholder="输入分钟数，例如 90"
          type="number"
          inputMode="numeric"
          pattern="[0-9]*"
          min={1}
          autoFocus
          className="w-full"
        />
      </div>
      <div className="flex gap-2 w-full">
        <Button onClick={onPrev} variant="outline" className="flex-1">
          上一步
        </Button>
        <Button
          onClick={handleNext}
          disabled={time === null || time <= 0}
          className="flex-1"
        >
          完成记录
        </Button>
      </div>
    </div>
  );
};

interface IDetailStep {
  range: {
    from: number;
    to: number;
  };
  setDescription: (description: string) => void;
  tags: string[];
  setTags: (tags: string[]) => void;
  title: string;
  onNext: () => void;
}
const DetailStep = ({
  range,
  title,
  setDescription,
  setTags,
  tags,
  onNext,
}: IDetailStep) => {
  const [customTag, setCustomTag] = useState("");

  // Default tag options
  const defaultTags = ["工作", "学习", "运动", "阅读", "休息", "娱乐"];

  // 计算持续时间（分钟）
  const durationMinutes = Math.round((range.to - range.from) / 1000 / 60);

  const handleDescriptionChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    setDescription(e.target.value.trim());
  };

  const toggleTag = (tag: string) => {
    setTags(
      tags.includes(tag) ? tags.filter((t) => t !== tag) : [...tags, tag],
    );
  };

  const addCustomTag = () => {
    setCustomTag("");

    const trimmedTag = customTag.trim();
    if (trimmedTag === "") return;

    if (tags.includes(trimmedTag)) {
      toast.error(`标签 "${trimmedTag}" 已存在`, {
        description: "请使用不同的标签名",
        duration: 3000,
      });
      return;
    }
    toggleTag(trimmedTag);
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
          你刚刚完成了 <span className="font-medium">{title}</span> 的工作，
          <span>
            {" "}
            投入了 {durationMinutes} 分钟的
            {getEffortPhrase(durationMinutes)}
          </span>
          。
        </p>

        <div className="bg-white/60 dark:bg-black/20 p-2 rounded-lg shadow-sm">
          <div className="flex items-center justify-center space-x-3 text-sm">
            <span>{formatDateTime(new Date(range.from))}</span>
            <div className="h-0.5 w-6 bg-green-300 dark:bg-green-700"></div>
            <span>{formatDateTime(new Date(range.to))}</span>
          </div>
        </div>
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
        <Button onClick={onNext} variant="outline" className="flex-1">
          记录下一项
        </Button>
      </div>
    </div>
  );
};

enum Step {
  Title = 0,
  Duration = 1,
  Detail = 2,
}

function nextStep(step: Step): Step {
  if (step === Step.Detail) {
    return Step.Title;
  }

  return step + 1;
}

function prevStep(step: Step): Step {
  if (step === Step.Title) {
    throw new Error("Cannot go back from Title step");
  }

  return step - 1;
}

function useNavigateToList() {
  const navigate = useNavigate();
  return () => {
    navigate({ to: "/list" });
  };
}

// Main Container
const ActivityTracker = () => {
  const navigateToList = useNavigateToList();
  const [step, setStep] = useState<Step>(Step.Title);
  const [timeEntryTitle, setTimeEntryTitle] = useState("");
  const [timeDuration, setTimeDuration] = useState<{
    from: number;
    to: number;
  } | null>(null);
  // const [timeEntryDescription, setTimeEntryDescription] = useState("");
  // const [timeEntryTags, setTimeEntryTags] = useState<string[]>([]);
  const [timeEntries, setTimeEntries] = useAtom(timeEntriesAtom);
  const [id, setId] = useState<string | null>(null);
  const timeEntry = timeEntries.find((x) => x.id === id);
  const timeEntryTags = timeEntry?.tags;
  const setTimeEntryTags = (
    tagsOrSetTags: string[] | ((prevTags: string[]) => string[]),
  ) => {
    setTimeEntries((prevEntries) => {
      const prevEntryIndex = prevEntries.findIndex((x) => x.id === id);
      if (prevEntryIndex === -1)
        throw new Error(`Time entry not found, id: ${id}`);

      const prevEntry = prevEntries[prevEntryIndex];
      const nextEntry = {
        ...prevEntry,
        tags:
          typeof tagsOrSetTags === "function"
            ? tagsOrSetTags(prevEntry.tags)
            : tagsOrSetTags,
      };

      const result = [
        ...prevEntries.slice(0, prevEntryIndex),
        nextEntry,
        ...prevEntries.slice(prevEntryIndex + 1),
      ];

      return result;
    });
  };
  const timeEntryDescription = timeEntry?.description;
  const setTimeEntryDescription = (
    descriptionOrSetDescription: string | ((prevDescription: string) => string),
  ) => {
    setTimeEntries((prevEntries) => {
      const prevEntryIndex = prevEntries.findIndex((x) => x.id === id);
      if (prevEntryIndex === -1)
        throw new Error(`Time entry not found, id: ${id}`);

      const prevEntry = prevEntries[prevEntryIndex];
      const nextEntry = {
        ...prevEntry,
        description:
          typeof descriptionOrSetDescription === "function"
            ? descriptionOrSetDescription(prevEntry.description)
            : descriptionOrSetDescription,
      };

      return [
        ...prevEntries.slice(0, prevEntryIndex),
        nextEntry,
        ...prevEntries.slice(prevEntryIndex + 1),
      ];
    });
  };

  const durationToDetail = useCallback(
    (duration: { from: number; to: number }) => {
      setTimeDuration(duration);

      const id = crypto.randomUUID();
      setId(id);

      setTimeEntries((prevEntries) => [
        ...prevEntries,
        {
          id,
          title: timeEntryTitle,
          description: timeEntryDescription || "",
          tags: timeEntryTags || [],
          from: duration.from,
          to: duration.to,
        },
      ]);

      setStep(nextStep(step));
    },
    [timeDuration, timeEntryTitle, timeEntryDescription, timeEntryTags, step],
  );

  const clearAll = () => {
    setTimeEntryTitle("");
    setTimeDuration(null);
    setId(null);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10">
      <Toaster position="top-center" />
      <div className="w-full max-w-sm p-6 border rounded-lg shadow-md bg-card text-card-foreground">
        <div className="flex justify-end mb-4">
          <Button
            variant="outline"
            size="sm"
            onClick={navigateToList}
            className="flex items-center gap-1"
          >
            <ListIcon />
            查看记录
          </Button>
        </div>

        <Steps currentStep={step + 1} totalSteps={3} className="mb-6" />

        <div className="text-center mb-6">
          <h2 className="text-xl font-bold">
            {step === Step.Title && "记录新事项"}
            {step === Step.Duration && "记录时间"}
            {step === Step.Detail && "完善记录"}
          </h2>
        </div>

        {step === Step.Title && (
          <TitleStep
            title={timeEntryTitle}
            setTitle={(value) => setTimeEntryTitle(value)}
            onNext={() => setStep(nextStep(step))}
          />
        )}

        {step === Step.Duration && (
          <DurationStep
            title={timeEntryTitle}
            onPrev={() => {
              setTimeDuration(null);
              setStep(prevStep(step));
            }}
            onNext={durationToDetail}
          />
        )}

        {step === Step.Detail && (
          <DetailStep
            range={timeDuration!}
            title={timeEntryTitle}
            setDescription={setTimeEntryDescription}
            setTags={setTimeEntryTags}
            tags={timeEntryTags!}
            onNext={() => {
              setStep(nextStep(step));
              clearAll();
            }}
          />
        )}
      </div>
    </div>
  );
};

export const Route = createFileRoute("/")({
  component: ActivityTracker,
});
