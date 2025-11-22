import { cn } from "@/lib/utils";

interface DottedSeparatorProps {
  className?: string;
  color?: string;
  height?: string;
  dotSize?: string;
  gap?: string;
  direction?: "horizontal" | "vertical";
}

const DottedSeparator = ({
  className,
  color = "#d4d4d8",
  height = "2px",
  dotSize = "2px",
  gap = "6px",
  direction = "horizontal",
}: DottedSeparatorProps) => {
  const isHorizontal = direction === "horizontal";
  return (
    <div
      className={cn(
        isHorizontal
          ? "w-full flex items-center"
          : "h-full flex flex-col items-center",
        className
      )}
    >
      <div
        className={isHorizontal ? "flex-grow" : "flex-grow-0"}
        style={{
          width: isHorizontal ? "100%" : height,
          height: isHorizontal ? height : "100%",
          backgroundImage: `radial-gradient(circle at center, ${color} 25%, transparent 26%)`,
          backgroundSize: isHorizontal
            ? `calc(${dotSize} + ${gap}) ${height}`
            : `${height} calc(${dotSize} + ${gap})`,
          backgroundRepeat: isHorizontal ? "repeat-x" : "repeat-y",
          backgroundPosition: "center",
        }}
      />
    </div>
  );
};

export { DottedSeparator };
