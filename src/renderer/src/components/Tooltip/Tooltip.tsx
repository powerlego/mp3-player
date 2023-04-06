import React, { PropsWithChildren } from "react";

type TooltipProps = PropsWithChildren<{
  direction?: "top" | "bottom" | "left" | "right";
  delay?: number;
  content: string;
  className?: string;
}>;

export default function Tooltip({ children, content, direction, delay, className }: TooltipProps) {
  let timeout: NodeJS.Timeout;
  const [active, setActive] = React.useState(false);

  const showTip = () => {
    timeout = setTimeout(() => {
      setActive(true);
    }, delay || 400);
  };

  const hideTip = () => {
    clearTimeout(timeout);
    setActive(false);
  };
  if (!content) {return <>{children}</>;}
  return (
    <div className={`${className ?? ""} inline-block relative`} onMouseEnter={showTip} onMouseLeave={hideTip}>
      {children}
      {active && <div className={`tooltip-tip ${direction || "top"}`}>{content}</div>}
    </div>
  );
}
