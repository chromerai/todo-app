import { useState, useRef, useEffect } from "react";
import { Task } from "@shared/routes";
import { useUpdateTask, useDeleteTask } from "@/hooks/use-tasks";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, GripVertical } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface TaskItemProps {
  task: Task;
}

export function TaskItem({ task }: TaskItemProps) {
  const updateTask = useUpdateTask();
  const deleteTask = useDeleteTask();
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(task.text);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleToggle = () => {
    updateTask.mutate({ 
      id: task.id, 
      isCompleted: !task.isCompleted 
    });
  };

  const handleSave = () => {
    if (editText.trim() !== task.text) {
      updateTask.mutate({ 
        id: task.id, 
        text: editText.trim() 
      });
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSave();
    } else if (e.key === "Escape") {
      setEditText(task.text);
      setIsEditing(false);
    }
  };

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, height: 0 }}
      className="group flex items-center gap-3 p-3 bg-card rounded-lg border border-border/50 hover:border-border hover:shadow-sm transition-all"
    >
      <div className="text-muted-foreground/40 cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity">
        <GripVertical className="h-4 w-4" />
      </div>

      <Checkbox 
        checked={task.isCompleted} 
        onCheckedChange={handleToggle}
        className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
      />

      <div className="flex-1 min-w-0">
        {isEditing ? (
          <Input
            ref={inputRef}
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            onBlur={handleSave}
            onKeyDown={handleKeyDown}
            className="h-8 py-1 px-2"
          />
        ) : (
          <span 
            onClick={() => setIsEditing(true)}
            className={cn(
              "block cursor-text truncate transition-all select-none",
              task.isCompleted && "text-muted-foreground line-through decoration-muted-foreground/50"
            )}
          >
            {task.text}
          </span>
        )}
      </div>

      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity hover:text-destructive hover:bg-destructive/10"
        onClick={() => deleteTask.mutate({ id: task.id, listId: task.listId })}
      >
        <Trash2 className="h-4 w-4" />
        <span className="sr-only">Delete</span>
      </Button>
    </motion.div>
  );
}
