
import React, { useState } from "react";
import { 
  add, 
  eachDayOfInterval, 
  endOfMonth, 
  endOfWeek, 
  format, 
  isEqual, 
  isSameDay, 
  isSameMonth, 
  isToday, 
  parse, 
  startOfDay,
  startOfMonth, 
  startOfWeek,
  isAfter,
  isBefore,
  endOfDay
} from "date-fns";
import { Button } from "@/components/ui/button";
import { CalendarEvent } from "@/contexts/AppDataContext";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface MonthlyCalendarProps {
  events: CalendarEvent[];
  onDateClick: (date: Date, events: CalendarEvent[]) => void;
}

const MonthlyCalendar = ({ events, onDateClick }: MonthlyCalendarProps) => {
  const today = new Date();
  const [selectedDate, setSelectedDate] = useState(today);
  const [currentMonth, setCurrentMonth] = useState(format(today, "MMM-yyyy"));
  
  const firstDayOfMonth = parse(currentMonth, "MMM-yyyy", new Date());
  
  const days = eachDayOfInterval({
    start: startOfWeek(startOfMonth(firstDayOfMonth)),
    end: endOfWeek(endOfMonth(firstDayOfMonth)),
  });
  
  const previousMonth = () => {
    const firstDayOfPrevMonth = add(firstDayOfMonth, { months: -1 });
    setCurrentMonth(format(firstDayOfPrevMonth, "MMM-yyyy"));
  };
  
  const nextMonth = () => {
    const firstDayOfNextMonth = add(firstDayOfMonth, { months: 1 });
    setCurrentMonth(format(firstDayOfNextMonth, "MMM-yyyy"));
  };
  
  const handleDateClick = (day: Date) => {
    setSelectedDate(day);
    
    // Find events for this day
    const dayStart = startOfDay(day);
    const dayEnd = endOfDay(day);
    
    const eventsForDay = events.filter(event => {
      const eventStart = new Date(event.start);
      const eventEnd = new Date(event.end);
      
      return (
        (isEqual(eventStart, dayStart) || isAfter(eventStart, dayStart)) &&
        (isEqual(eventStart, dayEnd) || isBefore(eventStart, dayEnd)) ||
        (isAfter(eventEnd, dayStart) && isBefore(eventStart, dayEnd))
      );
    });
    
    onDateClick(day, eventsForDay);
  };
  
  // Get events for a specific day
  const getEventsForDay = (day: Date) => {
    const dayStart = startOfDay(day);
    const dayEnd = endOfDay(day);
    
    return events.filter(event => {
      const eventStart = new Date(event.start);
      return (
        isSameDay(eventStart, day) ||
        (isAfter(eventStart, dayStart) && isBefore(eventStart, dayEnd))
      );
    });
  };
  
  return (
    <div className="select-none">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">
          {format(firstDayOfMonth, "MMMM yyyy")}
        </h2>
        <div className="flex items-center space-x-2">
          <Button
            onClick={previousMonth}
            variant="outline"
            size="icon"
          >
            <ChevronLeft className="h-5 w-5" />
            <span className="sr-only">Previous month</span>
          </Button>
          <Button
            onClick={() => {
              setCurrentMonth(format(today, "MMM-yyyy"));
            }}
            variant="outline"
            className="hidden sm:block"
          >
            Today
          </Button>
          <Button
            onClick={nextMonth}
            variant="outline"
            size="icon"
          >
            <ChevronRight className="h-5 w-5" />
            <span className="sr-only">Next month</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div
            key={day}
            className="h-10 flex items-center justify-center text-sm font-medium text-muted-foreground"
          >
            {day}
          </div>
        ))}

        {days.map((day, dayIndex) => {
          const dayEvents = getEventsForDay(day);
          const isSelectedDay = isSameDay(day, selectedDate);
          
          return (
            <div
              key={dayIndex}
              className={cn(
                "min-h-[80px] p-1 border rounded-md cursor-pointer",
                !isSameMonth(day, firstDayOfMonth) && "opacity-50 bg-muted/50",
                isToday(day) && "border-primary",
                isSelectedDay && "bg-primary/10"
              )}
              onClick={() => handleDateClick(day)}
            >
              <div className="flex items-center justify-between">
                <span
                  className={cn(
                    "text-sm font-medium h-7 w-7 flex items-center justify-center rounded-full",
                    isToday(day) && "bg-primary text-primary-foreground"
                  )}
                >
                  {format(day, "d")}
                </span>
              </div>
              <div className="mt-1 space-y-1 max-h-[60px] overflow-hidden">
                {dayEvents.slice(0, 3).map((event, eventIndex) => {
                  const eventType = event.type || "other";
                  
                  const getEventTypeStyles = (type: string) => {
                    switch (type) {
                      case 'exam':
                        return 'bg-red-500/80';
                      case 'assignment':
                        return 'bg-blue-500/80';
                      case 'meeting':
                        return 'bg-purple-500/80';
                      default:
                        return 'bg-gray-500/80';
                    }
                  };
                  
                  return (
                    <div
                      key={eventIndex}
                      className={cn(
                        "px-1 py-0.5 text-xs rounded text-white truncate",
                        getEventTypeStyles(eventType)
                      )}
                      title={event.title}
                    >
                      {format(new Date(event.start), "h:mm a")} {event.title}
                    </div>
                  );
                })}
                {dayEvents.length > 3 && (
                  <div className="text-xs text-muted-foreground text-center">
                    +{dayEvents.length - 3} more
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MonthlyCalendar;
