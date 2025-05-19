
import { useAppData, CalendarEvent } from "@/contexts/AppDataContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { Calendar, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

const UpcomingEvents = () => {
  const { events } = useAppData();
  const navigate = useNavigate();
  
  // Get all events starting from today
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const upcomingEvents = events
    .filter(event => new Date(event.start) >= today)
    .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime())
    .slice(0, 3);

  return (
    <Card className="col-span-12">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl font-semibold">Upcoming Events</CardTitle>
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-primary"
          onClick={() => navigate("/calendar")}
        >
          View calendar <ArrowRight className="ml-1 h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        {upcomingEvents.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {upcomingEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-40 text-center">
            <Calendar size={36} className="text-muted-foreground mb-2" />
            <h3 className="font-medium">No upcoming events</h3>
            <p className="text-sm text-muted-foreground">
              Add events to your calendar
            </p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => navigate("/calendar")}
            >
              Add Event
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

interface EventCardProps {
  event: CalendarEvent;
}

const EventCard = ({ event }: EventCardProps) => {
  const navigate = useNavigate();
  
  const getEventTypeStyles = (type: string) => {
    switch (type) {
      case 'exam':
        return 'border-red-500 bg-red-500/10';
      case 'assignment':
        return 'border-blue-500 bg-blue-500/10';
      case 'meeting':
        return 'border-purple-500 bg-purple-500/10';
      default:
        return 'border-gray-500 bg-gray-500/10';
    }
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "MMM dd, yyyy");
  };

  const formatTime = (dateString: string) => {
    return format(new Date(dateString), "h:mm a");
  };

  return (
    <div 
      className={cn(
        "p-4 border-l-4 rounded-md cursor-pointer hover:bg-accent/30 transition-colors",
        getEventTypeStyles(event.type)
      )}
      onClick={() => navigate(`/calendar?event=${event.id}`)}
    >
      <h3 className="font-medium mb-2 line-clamp-1">{event.title}</h3>
      <div className="flex items-center text-xs text-muted-foreground mb-1">
        <Calendar size={14} className="mr-1" />
        <span>{formatDate(event.start)}</span>
      </div>
      <div className="flex items-center text-xs text-muted-foreground">
        <span>{formatTime(event.start)} - {formatTime(event.end)}</span>
      </div>
      {event.description && (
        <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
          {event.description}
        </p>
      )}
      <div className="mt-2">
        <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium bg-primary/10 text-primary">
          {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
        </span>
      </div>
    </div>
  );
};

export default UpcomingEvents;
