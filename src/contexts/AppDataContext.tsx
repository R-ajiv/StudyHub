
import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";

// Type definitions
export interface Todo {
  id: string;
  title: string;
  completed: boolean;
  dueDate: string | null;
  priority: "low" | "medium" | "high";
  createdAt: string;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  category: string;
  createdAt: string;
  updatedAt: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  end: string;
  description: string;
  type: "assignment" | "exam" | "meeting" | "other";
}

interface AppData {
  todos: Todo[];
  notes: Note[];
  events: CalendarEvent[];
}

interface AppDataContextType {
  todos: Todo[];
  notes: Note[];
  events: CalendarEvent[];
  addTodo: (todo: Omit<Todo, "id" | "createdAt">) => void;
  updateTodo: (id: string, todo: Partial<Todo>) => void;
  deleteTodo: (id: string) => void;
  addNote: (note: Omit<Note, "id" | "createdAt" | "updatedAt">) => void;
  updateNote: (id: string, note: Partial<Note>) => void;
  deleteNote: (id: string) => void;
  addEvent: (event: Omit<CalendarEvent, "id">) => void;
  updateEvent: (id: string, event: Partial<CalendarEvent>) => void;
  deleteEvent: (id: string) => void;
}

const AppDataContext = createContext<AppDataContextType | undefined>(undefined);

export function AppDataProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [todos, setTodos] = useState<Todo[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [events, setEvents] = useState<CalendarEvent[]>([]);

  // Load user data from localStorage when user changes
  useEffect(() => {
    if (user) {
      const userData = localStorage.getItem(`appData_${user.id}`);
      if (userData) {
        const parsedData: AppData = JSON.parse(userData);
        setTodos(parsedData.todos || []);
        setNotes(parsedData.notes || []);
        setEvents(parsedData.events || []);
      } else {
        // Initialize with empty arrays if no data
        setTodos([]);
        setNotes([]);
        setEvents([]);
      }
    } else {
      // Clear data when logged out
      setTodos([]);
      setNotes([]);
      setEvents([]);
    }
  }, [user]);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    if (user) {
      const appData: AppData = {
        todos,
        notes,
        events,
      };
      localStorage.setItem(`appData_${user.id}`, JSON.stringify(appData));
    }
  }, [user, todos, notes, events]);

  // Todo functions
  const addTodo = (todo: Omit<Todo, "id" | "createdAt">) => {
    const newTodo: Todo = {
      ...todo,
      id: `todo_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setTodos(prev => [...prev, newTodo]);
  };

  const updateTodo = (id: string, todo: Partial<Todo>) => {
    setTodos(prev =>
      prev.map(item => (item.id === id ? { ...item, ...todo } : item))
    );
  };

  const deleteTodo = (id: string) => {
    setTodos(prev => prev.filter(todo => todo.id !== id));
  };

  // Note functions
  const addNote = (note: Omit<Note, "id" | "createdAt" | "updatedAt">) => {
    const now = new Date().toISOString();
    const newNote: Note = {
      ...note,
      id: `note_${Date.now()}`,
      createdAt: now,
      updatedAt: now,
    };
    setNotes(prev => [...prev, newNote]);
  };

  const updateNote = (id: string, note: Partial<Note>) => {
    setNotes(prev =>
      prev.map(item =>
        item.id === id
          ? { ...item, ...note, updatedAt: new Date().toISOString() }
          : item
      )
    );
  };

  const deleteNote = (id: string) => {
    setNotes(prev => prev.filter(note => note.id !== id));
  };

  // Event functions
  const addEvent = (event: Omit<CalendarEvent, "id">) => {
    const newEvent: CalendarEvent = {
      ...event,
      id: `event_${Date.now()}`,
    };
    setEvents(prev => [...prev, newEvent]);
  };

  const updateEvent = (id: string, event: Partial<CalendarEvent>) => {
    setEvents(prev =>
      prev.map(item => (item.id === id ? { ...item, ...event } : item))
    );
  };

  const deleteEvent = (id: string) => {
    setEvents(prev => prev.filter(event => event.id !== id));
  };

  return (
    <AppDataContext.Provider
      value={{
        todos,
        notes,
        events,
        addTodo,
        updateTodo,
        deleteTodo,
        addNote,
        updateNote,
        deleteNote,
        addEvent,
        updateEvent,
        deleteEvent,
      }}
    >
      {children}
    </AppDataContext.Provider>
  );
}

export const useAppData = () => {
  const context = useContext(AppDataContext);
  if (context === undefined) {
    throw new Error("useAppData must be used within an AppDataProvider");
  }
  return context;
};
