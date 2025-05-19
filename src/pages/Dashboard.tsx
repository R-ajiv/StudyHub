
import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useAppData } from "@/contexts/AppDataContext";
import OverviewCard from "@/components/dashboard/OverviewCard";
import RecentNotes from "@/components/dashboard/RecentNotes";
import TodoList from "@/components/dashboard/TodoList";
import UpcomingEvents from "@/components/dashboard/UpcomingEvents";
import { BookOpen, ListCheck, Calendar } from "lucide-react";
import { Card } from "@/components/ui/card";

const Dashboard = () => {
  const { user } = useAuth();
  const { notes, todos, events } = useAppData();
  
  const incompleteTasks = todos.filter(todo => !todo.completed).length;
  const upcomingEvents = events.filter(event => new Date(event.start) >= new Date()).length;
  
  // Get today's date to display a greeting
  const currentHour = new Date().getHours();
  let greeting = "Hello";
  
  if (currentHour < 12) {
    greeting = "Good morning";
  } else if (currentHour < 18) {
    greeting = "Good afternoon";
  } else {
    greeting = "Good evening";
  }

  // Get user display name from metadata or email
  const getDisplayName = () => {
    if (!user) return "User";
    
    // Try to get name from user metadata
    const metadata = user.user_metadata || {};
    const name = metadata.name || metadata.full_name || "";
    
    if (name && typeof name === 'string' && name.length > 0) {
      return name;
    }
    
    // Fallback to email without domain
    if (user.email) {
      return user.email.split('@')[0];
    }
    
    return "User";
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="py-2">
        <h2 className="text-3xl font-bold tracking-tight gold-gradient-text">
          {greeting}, {getDisplayName()}
        </h2>
        <p className="text-muted-foreground">
          Here's an overview of your study progress and upcoming tasks.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <OverviewCard
          title="Notes"
          value={notes.length}
          icon={<BookOpen size={18} />}
          description="Total notes created"
          className="glass-card"
        />
        <OverviewCard
          title="Tasks"
          value={incompleteTasks}
          icon={<ListCheck size={18} />}
          description="Pending tasks"
          className="glass-card"
        />
        <OverviewCard
          title="Events"
          value={upcomingEvents}
          icon={<Calendar size={18} />}
          description="Upcoming events"
          className="glass-card"
        />
      </div>

      <Card className="glass-card overflow-hidden border-app-gold-500/20 shadow-lg shadow-app-gold-500/5">
        <div className="p-6">
          <h3 className="text-xl font-semibold mb-4 gold-gradient-text">Today's Focus</h3>
          <TodoList compact={true} />
        </div>
      </Card>

      <div className="grid gap-4 grid-cols-12">
        <RecentNotes />
        <div className="col-span-12 lg:col-span-6">
          <UpcomingEvents />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
