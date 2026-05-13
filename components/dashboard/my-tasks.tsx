import Link from "next/link";
import { getDeadlineClass } from "@/lib/utils";
import type { Task } from "@/types";
import { ChevronRight } from "lucide-react";

const dotColor: Record<string, string> = {
  high:   "bg-risk-high",
  medium: "bg-risk-medium",
  low:    "bg-risk-low",
};

export function MyTasks({ tasks }: { tasks: Task[] }) {
  return (
    <div className="audit-card flex h-full min-h-0 min-w-0 w-full flex-1 flex-col overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-[rgba(255,255,255,0.04)]">
        <p className="text-[11px] font-semibold tracking-[0.08em] uppercase text-secondary-300">
          My Tasks
        </p>
        <Link href="/governance" className="text-[11px] text-primary font-medium hover:text-primary-300 transition-colors">
          View all →
        </Link>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="flex items-center gap-3 px-5 py-3 border-b border-[rgba(255,255,255,0.04)] last:border-0 cursor-pointer hover:bg-[rgba(42,30,92,0.5)] transition-colors duration-150"
          >
            <div className={`w-2 h-2 rounded-full flex-shrink-0 ${dotColor[task.priority]}`} />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-secondary-100 truncate">{task.title}</p>
              <p className="text-[10px] text-secondary-300 mt-0.5">{task.meta}</p>
            </div>
            <span className={`text-[10px] font-semibold flex-shrink-0 ${getDeadlineClass(task.deadlineStatus)}`}>
              {task.due}
            </span>
            <div className="w-6 h-6 flex items-center justify-center border border-[rgba(255,255,255,0.08)] rounded-sm text-secondary-300 hover:border-primary hover:text-primary transition-all flex-shrink-0">
              <ChevronRight size={12} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
