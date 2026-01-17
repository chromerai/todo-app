import { useState } from "react";
import { Link, useRoute } from "wouter";
import { useList } from "@/hooks/use-lists";
import { useTasks, useCreateTask } from "@/hooks/use-tasks";
import { TaskItem } from "@/components/task-item";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Plus, Calendar } from "lucide-react";
import { format } from "date-fns";
import { AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

export default function ListDetail() {
  const [, params] = useRoute("/list/:id");
  const listId = Number(params?.id);
  const { toast } = useToast();
  
  const { data: list, isLoading: isListLoading } = useList(listId);
  const { data: tasks, isLoading: isTasksLoading } = useTasks(listId);
  const createTask = useCreateTask();
  
  const [newTaskText, setNewTaskText] = useState("");

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskText.trim()) return;
    
    createTask.mutate(
      { listId, text: newTaskText.trim() },
      {
        onSuccess: () => setNewTaskText(""),
        onError: (error) => {
          toast({
            title: "Error",
            description: error.message,
            variant: "destructive",
          });
        }
      }
    );
  };

  if (isListLoading || isTasksLoading) {
    return (
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="space-y-4">
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-12 w-3/4" />
        </div>
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-12 w-full rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  if (!list) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold mb-4">List not found</h2>
        <Link href="/dashboard">
          <Button>Return to Dashboard</Button>
        </Link>
      </div>
    );
  }

  const completedCount = tasks?.filter(t => t.isCompleted).length || 0;
  const totalCount = tasks?.length || 0;
  const progress = totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="space-y-6">
        <Link href="/dashboard" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors">
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back to Lists
        </Link>
        
        <div>
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground">
              {list.name}
            </h1>
            <span className="text-xs font-medium px-2 py-1 bg-secondary text-secondary-foreground rounded-md">
              {list.type}
            </span>
          </div>
          
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              Created {format(new Date(list.createdAt!), "MMM d, yyyy")}
            </div>
            <span>•</span>
            <div>{completedCount} / {totalCount} completed</div>
          </div>
          
          {/* Progress bar */}
          <div className="mt-4 h-1.5 w-full bg-secondary rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <form onSubmit={handleCreateTask} className="flex gap-2">
          <Input 
            placeholder="Add a new task..." 
            value={newTaskText}
            onChange={(e) => setNewTaskText(e.target.value)}
            className="h-12 text-base shadow-sm focus-visible:ring-primary/20"
          />
          <Button 
            type="submit" 
            size="icon" 
            className="h-12 w-12 shrink-0 shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 transition-all"
            disabled={!newTaskText.trim() || createTask.isPending}
          >
            <Plus className="h-5 w-5" />
          </Button>
        </form>

        <div className="space-y-2">
          <AnimatePresence initial={false} mode="popLayout">
            {tasks?.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground italic">
                No tasks yet. Add one above!
              </div>
            ) : (
              tasks?.map((task) => (
                <TaskItem key={task.id} task={task} />
              ))
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
