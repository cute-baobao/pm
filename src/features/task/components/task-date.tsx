import { cn } from "@/lib/utils";
import { differenceInDays } from "date-fns";
import { useFormatter } from "next-intl";

interface TaskDateProps {
  value: Date | string;
  className?: string;
}

export function TaskDate({ value, className }: TaskDateProps) {
    const format = useFormatter();
    const today = new Date();
    const endDate = new Date(value);
    const diffInDays = differenceInDays(endDate, today);

    let textColor = "text-muted-foreground";
    if(diffInDays <= 3) {
        textColor = "text-red-500";
    } else if (diffInDays <= 7) {
        textColor = "text-yellow-500";
    } else if(diffInDays <= 14) {
        textColor = "text-orange-500";  
    }

    return (
        <div className={textColor}>
            <span className={cn("truncate",className)}>
                {format.dateTime(endDate, { dateStyle: 'long' })}
            </span>
        </div>
    );
}