'use client';

import * as React from "react";
import { Card, CardContent } from "./card";
import { Button } from "./button";
import { Pencil, Trash2 } from "lucide-react";
import { motion } from "framer-motion";

export interface TaskType {
  id: string;
  taskName: string;
  amount: number;
  goalId?: string;
  createdAt: Date | string;
}

interface TaskCardProps {
  task: TaskType;
  onEdit: (task: TaskType) => void;
  onDelete: (id: string) => void;
  index: number;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onEdit,
  onDelete,
  index,
}) => {
  const formattedDate = new Date(task.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.04 }}
      className="w-full"
    >
      <Card hoverable className="border border-white/60 bg-white/70 overflow-hidden shadow-sm">
        <CardContent className="p-5 flex items-center justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h4 className="font-heading font-bold text-slate-800 text-base md:text-lg truncate">
              {task.taskName}
            </h4>
            <p className="text-xs text-slate-400 font-medium mt-1">
              {formattedDate}
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Amount */}
            <div className="text-right">
              <span className="font-heading font-black text-slate-700 text-lg md:text-xl">
                {task.amount.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}
              </span>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1.5">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onEdit(task)}
                className="h-9 w-9 rounded-xl text-slate-500 hover:bg-[#73a0c8]/10 hover:text-[#73a0c8] transition-colors duration-300"
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onDelete(task.id)}
                className="h-9 w-9 rounded-xl text-slate-400 hover:bg-red-50 hover:text-red-500 transition-colors duration-300"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
