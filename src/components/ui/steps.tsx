import * as React from "react";
import { cn } from "@/lib/utils";

export interface StepsProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * 当前激活的步骤（从1开始）
   */
  currentStep: number;

  /**
   * 步骤的总数
   */
  totalSteps?: number;

  /**
   * 要显示的步骤标签
   * 默认为数字 1, 2, 3...
   */
  stepLabels?: React.ReactNode[];

  /**
   * 连接线的宽度
   */
  connectorWidth?: string;

  /**
   * 步骤项的大小
   */
  stepSize?: string;
}

export const Steps = React.forwardRef<HTMLDivElement, StepsProps>(
  (
    {
      currentStep,
      totalSteps = 3,
      stepLabels,
      connectorWidth = "w-10",
      stepSize = "w-8 h-8",
      className,
      ...props
    },
    ref,
  ) => {
    // 如果没有提供标签，使用默认的数字
    const labels =
      stepLabels || Array.from({ length: totalSteps }, (_, i) => i + 1);

    return (
      <div
        ref={ref}
        className={cn("flex items-center justify-center", className)}
        {...props}
      >
        <div className="flex items-center space-x-3">
          {labels.map((label, index) => {
            const isActive = currentStep >= index + 1;
            const isLastStep = index === labels.length - 1;

            return (
              <React.Fragment key={index}>
                <div
                  className={cn(
                    `${stepSize} rounded-full flex items-center justify-center`,
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground",
                  )}
                >
                  {label}
                </div>

                {/* 连接线，最后一步后不需要 */}
                {!isLastStep && (
                  <div
                    className={cn(
                      `${connectorWidth} h-1`,
                      currentStep > index + 1 ? "bg-primary" : "bg-muted",
                    )}
                  ></div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    );
  },
);

Steps.displayName = "Steps";
