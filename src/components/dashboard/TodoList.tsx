
import { useAppData, Todo } from "@/contexts/AppDataContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { format } from "date-fns";
import { ListCheck, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface TodoListProps {
  compact?: boolean;
}

const TodoList = ({ compact = false }: TodoListProps) => {
  const { todos, updateTodo } = useAppData();
  const navigate = useNavigate();
  
  const incompleteTodos = todos
    .filter(todo => !todo.completed)
    .sort((a, b) => {
      // Sort by due date if available
      if (a.dueDate && b.dueDate) {
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      }
      // Sort by priority if due dates are not available
      const priorityValues = { high: 0, medium: 1, low: 2 };
      return priorityValues[a.priority] - priorityValues[b.priority];
    })
    .slice(0, compact ? 3 : 5);

  // If compact mode is enabled, we'll use a simpler layout
  if (compact) {
    return (
      <div className="space-y-3">
        {incompleteTodos.length > 0 ? (
          <>
            {incompleteTodos.map((todo) => (
              <CompactTodoItem key={todo.id} todo={todo} updateTodo={updateTodo} />
            ))}
            <div className="flex justify-end pt-2">
              <Button 
                variant="link" 
                size="sm"
                className="text-primary"
                onClick={() => navigate("/tasks")}
              >
                View all tasks <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center py-6 text-center">
            <div>
              <ListCheck size={24} className="text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">No pending tasks</p>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Regular non-compact view
  return (
    <Card className="col-span-12 lg:col-span-6">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl font-semibold">Upcoming Tasks</CardTitle>
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-primary"
          onClick={() => navigate("/tasks")}
        >
          View all <ArrowRight className="ml-1 h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        {incompleteTodos.length > 0 ? (
          <div className="space-y-2">
            {incompleteTodos.map((todo) => (
              <TodoItem key={todo.id} todo={todo} updateTodo={updateTodo} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-40 text-center">
            <ListCheck size={36} className="text-muted-foreground mb-2" />
            <h3 className="font-medium">No tasks pending</h3>
            <p className="text-sm text-muted-foreground">
              Add a task to get started
            </p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => navigate("/tasks")}
            >
              Add Task
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

interface TodoItemProps {
  todo: Todo;
  updateTodo: (id: string, todo: Partial<Todo>) => void;
}

const CompactTodoItem = ({ todo, updateTodo }: TodoItemProps) => {
  const handleStatusChange = (checked: boolean) => {
    updateTodo(todo.id, { completed: checked });
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

  return (
    <div className="flex items-center space-x-3 p-2.5 border border-primary/20 rounded-md bg-background/60 backdrop-blur-sm shadow-sm">
      <Checkbox 
        id={`compact-task-${todo.id}`} 
        checked={todo.completed}
        onCheckedChange={handleStatusChange}
      />
      <div className="flex-1 min-w-0">
        <label 
          htmlFor={`compact-task-${todo.id}`}
          className="text-sm font-medium cursor-pointer"
        >
          {todo.title}
        </label>
        {todo.dueDate && (
          <p className="text-xs text-muted-foreground">
            Due {format(new Date(todo.dueDate), 'MMM dd')}
          </p>
        )}
      </div>
      <div 
        className={`h-2 w-2 rounded-full ${getPriorityColor(todo.priority)}`} 
        title={`${todo.priority} priority`}
      />
    </div>
  );
};

const TodoItem = ({ todo, updateTodo }: TodoItemProps) => {
  const handleStatusChange = (checked: boolean) => {
    updateTodo(todo.id, { completed: checked });
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

  return (
    <div className="flex items-start space-x-3 p-3 border rounded-md">
      <Checkbox 
        id={`task-${todo.id}`} 
        checked={todo.completed}
        onCheckedChange={handleStatusChange}
      />
      <div className="flex-1 min-w-0">
        <label 
          htmlFor={`task-${todo.id}`}
          className="text-sm font-medium cursor-pointer"
        >
          {todo.title}
        </label>
        {todo.dueDate && (
          <p className="text-xs text-muted-foreground">
            Due {format(new Date(todo.dueDate), 'MMM dd')}
          </p>
        )}
      </div>
      <div 
        className={`h-2 w-2 rounded-full ${getPriorityColor(todo.priority)}`} 
        title={`${todo.priority} priority`}
      />
    </div>
  );
};

export default TodoList;
