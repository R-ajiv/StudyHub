
import React, { useState } from "react";
import { useAppData, CalendarEvent } from "@/contexts/AppDataContext";
import MonthlyCalendar from "@/components/features/calendar/MonthlyCalendar";
import EventForm from "@/components/features/calendar/EventForm";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Clock, Trash } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";

const Calendar = () => {
  const { events, addEvent, updateEvent, deleteEvent } = useAppData();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedEvents, setSelectedEvents] = useState<CalendarEvent[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [showEventForm, setShowEventForm] = useState(false);
  const isMobile = useIsMobile();
  
  const handleDateClick = (date: Date, eventsForDay: CalendarEvent[]) => {
    setSelectedDate(date);
    setSelectedEvents(eventsForDay);
  };
  
  const handleAddEvent = () => {
    setSelectedEvent(null);
    setShowEventForm(true);
  };
  
  const handleEditEvent = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setShowEventForm(true);
  };
  
  const handleSaveEvent = (event: Omit<CalendarEvent, "id">) => {
    addEvent(event);
    setShowEventForm(false);
    toast.success("Event created");
  };
  
  const handleUpdateEvent = (event: Omit<CalendarEvent, "id">) => {
    if (selectedEvent) {
      updateEvent(selectedEvent.id, event);
      setSelectedEvent(null);
      setShowEventForm(false);
      toast.success("Event updated");
    }
  };
  
  const handleDeleteEvent = (id: string) => {
    deleteEvent(id);
    // Remove from selected events
    setSelectedEvents(prev => prev.filter(event => event.id !== id));
    toast.success("Event deleted");
  };
  
  // Get event type badge styles
  const getEventTypeStyles = (type: string) => {
    switch (type) {
      case 'exam':
        return 'bg-red-500/10 text-red-500 border-red-500';
      case 'assignment':
        return 'bg-blue-500/10 text-blue-500 border-blue-500';
      case 'meeting':
        return 'bg-purple-500/10 text-purple-500 border-purple-500';
      default:
        return 'bg-gray-500/10 text-gray-500 border-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Calendar</h2>
          <p className="text-muted-foreground">
            Plan your study schedule and keep track of important dates.
          </p>
        </div>
        <Button onClick={handleAddEvent}>
          <Plus className="mr-2 h-4 w-4" /> Add Event
        </Button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="p-6">
              <MonthlyCalendar 
                events={events} 
                onDateClick={handleDateClick} 
              />
            </CardContent>
          </Card>
        </div>
        
        <div className="lg:col-span-1">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Events for {format(selectedDate, "MMMM d, yyyy")}</CardTitle>
            </CardHeader>
            <CardContent>
              {selectedEvents.length > 0 ? (
                <div className="space-y-4">
                  {selectedEvents.map((event) => (
                    <div 
                      key={event.id}
                      className={`p-4 border-l-4 rounded-md cursor-pointer hover:bg-accent/30 transition-colors ${getEventTypeStyles(event.type)}`}
                      onClick={() => handleEditEvent(event)}
                    >
                      <h3 className="font-medium mb-2">{event.title}</h3>
                      
                      <div className="flex items-center text-xs text-muted-foreground mb-2">
                        <Clock className="mr-1 h-3.5 w-3.5" />
                        <span>
                          {format(new Date(event.start), "h:mm a")} - {format(new Date(event.end), "h:mm a")}
                        </span>
                      </div>
                      
                      {event.description && (
                        <p className="text-sm text-muted-foreground mt-2">
                          {event.description}
                        </p>
                      )}
                      
                      <div className="flex justify-between items-center mt-3">
                        <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium bg-primary/10 text-primary">
                          {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                        </span>
                        
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteEvent(event.id);
                          }}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <CalendarIcon className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium">No events scheduled</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Add an event to this date
                  </p>
                  <Button onClick={handleAddEvent}>
                    <Plus className="mr-2 h-4 w-4" /> Add Event
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Event Form Dialog (Desktop) */}
      {!isMobile && showEventForm && (
        <Dialog open={showEventForm} onOpenChange={setShowEventForm}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogTitle>
              {selectedEvent ? "Edit Event" : "Add New Event"}
            </DialogTitle>
            <EventForm
              initialEvent={selectedEvent || undefined}
              onSubmit={selectedEvent ? handleUpdateEvent : handleSaveEvent}
              onCancel={() => {
                setShowEventForm(false);
                setSelectedEvent(null);
              }}
            />
          </DialogContent>
        </Dialog>
      )}
      
      {/* Event Form Sheet (Mobile) */}
      {isMobile && (
        <Sheet open={showEventForm} onOpenChange={setShowEventForm}>
          <SheetContent side="bottom" className="h-[70vh] pt-10">
            <SheetHeader>
              <SheetTitle>
                {selectedEvent ? "Edit Event" : "Add New Event"}
              </SheetTitle>
            </SheetHeader>
            <div className="mt-6 overflow-y-auto pb-20">
              <EventForm
                initialEvent={selectedEvent || undefined}
                onSubmit={selectedEvent ? handleUpdateEvent : handleSaveEvent}
                onCancel={() => {
                  setShowEventForm(false);
                  setSelectedEvent(null);
                }}
              />
            </div>
          </SheetContent>
        </Sheet>
      )}
    </div>
  );
};

// Calendar icon component
const CalendarIcon = ({ className }: { className?: string }) => (
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
      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
    />
  </svg>
);

export default Calendar;
