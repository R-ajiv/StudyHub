
import { useState } from "react";
import { Todo } from "@/contexts/AppDataContext";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { format } from "date-fns";
import { Edit, Trash } from "lucide-react";
import { cn } from "@/lib/utils";

interface TaskItemProps {
  task: Todo;
  onStatusChange: (id: string, completed: boolean) => void;
  onEdit: (task: Todo) => void;
  onDelete: (id: string) => void;
}

const TaskItem = ({ task, onStatusChange, onEdit, onDelete }: TaskItemProps) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const handleStatusChange = (checked: boolean) => {
    onStatusChange(task.id, checked);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-500';
      case 'medium':
        return 'bg-yellow-500';
      case 'low':
        return 'bg-green-500';
      default:
        return 'bg-blue-500';
    }
  };

  const isOverdue = task.dueDate && !task.completed && new Date(task.dueDate) < new Date();

  return (
    <Card 
      className={cn(
        "transition-all",
        task.completed ? "opacity-70 bg-muted/30" : "",
        isHovered ? "shadow-md" : ""
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardContent className="p-4 flex items-center justify-between">
        <div className="flex items-center space-x-4 flex-1">
          <Checkbox 
            id={`task-${task.id}`} 
            checked={task.completed}
            onCheckedChange={handleStatusChange}
            className="h-5 w-5"
          />
          
          <div className="flex-1 min-w-0">
            <label 
              htmlFor={`task-${task.id}`}
              className={cn(
                "text-base font-medium cursor-pointer",
                task.completed && "line-through text-muted-foreground"
              )}
            >
              {task.title}
            </label>
            
            <div className="flex items-center mt-1">
              {task.dueDate && (
                <span className={cn(
                  "text-xs",
                  isOverdue && !task.completed ? "text-red-500" : "text-muted-foreground"
                )}>
                  Due {format(new Date(task.dueDate), 'MMM dd, yyyy')}
                </span>
              )}
              
              <div 
                className={`h-2 w-2 rounded-full ml-2 ${getPriorityColor(task.priority)}`} 
                title={`${task.priority} priority`}
              />
            </div>
          </div>
        </div>
        
        <div className={cn(
          "flex items-center space-x-1",
          isHovered ? "opacity-100" : "opacity-0"
        )}>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => onEdit(task)}
          >
            <Edit className="h-4 w-4" />
          </Button>
          
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => onDelete(task.id)}
          >
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default TaskItem;
