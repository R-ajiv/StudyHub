
import React, { useState } from "react";
import { useAppData, Todo } from "@/contexts/AppDataContext";
import TaskForm from "@/components/features/tasks/TaskForm";
import TaskItem from "@/components/features/tasks/TaskItem";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Plus, Search } from "lucide-react";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";

const Tasks = () => {
  const { todos, addTodo, updateTodo, deleteTodo } = useAppData();
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Todo | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewType, setViewType] = useState<"all" | "active" | "completed">("all");
  const isMobile = useIsMobile();
  
  const handleAddTask = (task: Omit<Todo, "id" | "createdAt">) => {
    addTodo(task);
    setShowTaskForm(false);
    toast.success("Task added");
  };
  
  const handleUpdateTask = (task: Omit<Todo, "id" | "createdAt">) => {
    if (editingTask) {
      updateTodo(editingTask.id, task);
      setEditingTask(null);
      setShowTaskForm(false);
      toast.success("Task updated");
    }
  };
  
  const handleEditTask = (task: Todo) => {
    setEditingTask(task);
    setShowTaskForm(true);
  };
  
  const handleDeleteTask = (id: string) => {
    deleteTodo(id);
    toast.success("Task deleted");
  };
  
  const handleStatusChange = (id: string, completed: boolean) => {
    updateTodo(id, { completed });
    toast.success(completed ? "Task completed" : "Task marked incomplete");
  };
  
  // Filter tasks based on search term and view type
  const filteredTasks = todos.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase());
    
    switch (viewType) {
      case "active":
        return !task.completed && matchesSearch;
      case "completed":
        return task.completed && matchesSearch;
      default:
        return matchesSearch;
    }
  });
  
  // Sort tasks by due date and priority
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    // First sort by completion status
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1;
    }
    
    // Then sort by due date (if available)
    if (a.dueDate && b.dueDate) {
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    }
    
    // Then sort by priority
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    if (a.priority !== b.priority) {
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    }
    
    // Finally sort by creation date
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Tasks</h2>
          <p className="text-muted-foreground">
            Manage your assignments, homework, and study tasks.
          </p>
        </div>
        <Button onClick={() => {
          setEditingTask(null);
          setShowTaskForm(true);
        }}>
          <Plus className="mr-2 h-4 w-4" /> Add Task
        </Button>
      </div>
      
      <div className="flex items-center mb-6 relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Search tasks..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>
      
      <Tabs 
        defaultValue="all" 
        value={viewType} 
        onValueChange={(v) => setViewType(v as "all" | "active" | "completed")}
        className="w-full"
      >
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="all">All ({todos.length})</TabsTrigger>
          <TabsTrigger value="active">Active ({todos.filter(t => !t.completed).length})</TabsTrigger>
          <TabsTrigger value="completed">Completed ({todos.filter(t => t.completed).length})</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="space-y-4">
          {sortedTasks.length > 0 ? (
            sortedTasks.map(task => (
              <TaskItem
                key={task.id}
                task={task}
                onStatusChange={handleStatusChange}
                onEdit={handleEditTask}
                onDelete={handleDeleteTask}
              />
            ))
          ) : (
            <EmptyTaskState 
              searchTerm={searchTerm} 
              onAddTask={() => {
                setEditingTask(null);
                setShowTaskForm(true);
              }}
              onClearSearch={() => setSearchTerm("")}
            />
          )}
        </TabsContent>
        
        <TabsContent value="active" className="space-y-4">
          {sortedTasks.length > 0 ? (
            sortedTasks.map(task => (
              <TaskItem
                key={task.id}
                task={task}
                onStatusChange={handleStatusChange}
                onEdit={handleEditTask}
                onDelete={handleDeleteTask}
              />
            ))
          ) : (
            <EmptyTaskState 
              title={searchTerm ? "No matching tasks" : "No active tasks"} 
              description={searchTerm ? "Try adjusting your search" : "All tasks are completed!"}
              searchTerm={searchTerm} 
              onAddTask={() => {
                setEditingTask(null);
                setShowTaskForm(true);
              }}
              onClearSearch={() => setSearchTerm("")}
            />
          )}
        </TabsContent>
        
        <TabsContent value="completed" className="space-y-4">
          {sortedTasks.length > 0 ? (
            sortedTasks.map(task => (
              <TaskItem
                key={task.id}
                task={task}
                onStatusChange={handleStatusChange}
                onEdit={handleEditTask}
                onDelete={handleDeleteTask}
              />
            ))
          ) : (
            <EmptyTaskState 
              title={searchTerm ? "No matching tasks" : "No completed tasks"} 
              description={searchTerm ? "Try adjusting your search" : "Complete some tasks to see them here."}
              searchTerm={searchTerm} 
              onAddTask={() => {
                setEditingTask(null);
                setShowTaskForm(true);
              }}
              onClearSearch={() => setSearchTerm("")}
            />
          )}
        </TabsContent>
      </Tabs>
      
      {/* Task Form Dialog (Desktop) */}
      {!isMobile && showTaskForm && (
        <Dialog open={showTaskForm} onOpenChange={setShowTaskForm}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogTitle>
              {editingTask ? "Edit Task" : "Add New Task"}
            </DialogTitle>
            <TaskForm
              initialTask={editingTask || undefined}
              onSubmit={editingTask ? handleUpdateTask : handleAddTask}
              onCancel={() => {
                setShowTaskForm(false);
                setEditingTask(null);
              }}
            />
          </DialogContent>
        </Dialog>
      )}
      
      {/* Task Form Sheet (Mobile) */}
      {isMobile && (
        <Sheet open={showTaskForm} onOpenChange={setShowTaskForm}>
          <SheetContent side="bottom" className="h-[60vh] pt-10">
            <SheetHeader>
              <SheetTitle>
                {editingTask ? "Edit Task" : "Add New Task"}
              </SheetTitle>
            </SheetHeader>
            <div className="mt-6">
              <TaskForm
                initialTask={editingTask || undefined}
                onSubmit={editingTask ? handleUpdateTask : handleAddTask}
                onCancel={() => {
                  setShowTaskForm(false);
                  setEditingTask(null);
                }}
              />
            </div>
          </SheetContent>
        </Sheet>
      )}
    </div>
  );
};

interface EmptyTaskStateProps {
  title?: string;
  description?: string;
  searchTerm: string;
  onAddTask: () => void;
  onClearSearch: () => void;
}

const EmptyTaskState = ({ 
  title = "No tasks", 
  description = "Start by adding a task",
  searchTerm, 
  onAddTask, 
  onClearSearch 
}: EmptyTaskStateProps) => (
  <div className="flex flex-col items-center justify-center text-center p-8 border rounded-lg">
    <ClipboardIcon className="h-12 w-12 text-muted-foreground mb-4" />
    <h3 className="text-lg font-semibold mb-2">{title}</h3>
    <p className="text-muted-foreground mb-4">{description}</p>
    
    <div className="flex gap-2">
      {searchTerm ? (
        <Button variant="outline" onClick={onClearSearch}>
          Clear Search
        </Button>
      ) : (
        <Button onClick={onAddTask}>
          <Plus className="mr-2 h-4 w-4" /> Add Task
        </Button>
      )}
    </div>
  </div>
);

// Clipboard icon component
const ClipboardIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    className={className}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
    />
  </svg>
);

export default Tasks;
