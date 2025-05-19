
import React, { useState, useEffect } from "react";
import { CalendarEvent } from "@/contexts/AppDataContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar as CalendarIcon, Clock } from "lucide-react";
import { format, addHours, setHours, setMinutes } from "date-fns";
import { cn } from "@/lib/utils";

interface EventFormProps {
  initialEvent?: CalendarEvent;
  onSubmit: (event: Omit<CalendarEvent, "id">) => void;
  onCancel?: () => void;
}

const eventTypes = [
  { value: "assignment", label: "Assignment" },
  { value: "exam", label: "Exam" },
  { value: "meeting", label: "Meeting" },
  { value: "other", label: "Other" },
];

const timeOptions = Array.from({ length: 24 * 4 }, (_, i) => {
  const hour = Math.floor(i / 4);
  const minute = (i % 4) * 15;
  return {
    value: `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`,
    label: format(setHours(setMinutes(new Date(), minute), hour), "h:mm a"),
  };
});

const EventForm = ({ initialEvent, onSubmit, onCancel }: EventFormProps) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("10:00");
  const [eventType, setEventType] = useState<"assignment" | "exam" | "meeting" | "other">("other");

  // Set form values when initialEvent changes
  useEffect(() => {
    if (initialEvent) {
      setTitle(initialEvent.title);
      setDescription(initialEvent.description);
      
      const start = new Date(initialEvent.start);
      setDate(start);
      setStartTime(format(start, "HH:mm"));
      
      const end = new Date(initialEvent.end);
      setEndTime(format(end, "HH:mm"));
      
      setEventType(initialEvent.type);
    } else {
      // Set default values for new event
      const now = new Date();
      setTitle("");
      setDescription("");
      setDate(now);
      setStartTime("09:00");
      setEndTime("10:00");
      setEventType("other");
    }
  }, [initialEvent]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!date) return;
    
    // Create Date objects for start and end times
    const [startHour, startMinute] = startTime.split(":").map(Number);
    const [endHour, endMinute] = endTime.split(":").map(Number);
    
    const startDate = new Date(date);
    startDate.setHours(startHour, startMinute, 0);
    
    const endDate = new Date(date);
    endDate.setHours(endHour, endMinute, 0);
    
    // Ensure end time is after start time
    if (endDate <= startDate) {
      endDate.setDate(endDate.getDate() + 1);
    }
    
    const event = {
      title,
      description,
      start: startDate.toISOString(),
      end: endDate.toISOString(),
      type: eventType,
    };
    
    onSubmit(event);
    
    if (!initialEvent) {
      // Clear form for new events
      setTitle("");
      setDescription("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="title" className="text-sm font-medium">
          Event Title
        </label>
        <Input
          id="title"
          placeholder="Enter event title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="event-type" className="text-sm font-medium">
          Event Type
        </label>
        <Select 
          value={eventType} 
          onValueChange={(value) => setEventType(value as any)}
        >
          <SelectTrigger id="event-type">
            <SelectValue placeholder="Select event type" />
          </SelectTrigger>
          <SelectContent>
            {eventTypes.map((type) => (
              <SelectItem key={type.value} value={type.value}>
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">
          Date
        </label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-full justify-start text-left font-normal",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, "PPP") : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              initialFocus
              className="pointer-events-auto"
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="start-time" className="text-sm font-medium">
            Start Time
          </label>
          <Select value={startTime} onValueChange={setStartTime}>
            <SelectTrigger id="start-time" className="w-full">
              <div className="flex items-center">
                <Clock className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Select start time" />
              </div>
            </SelectTrigger>
            <SelectContent>
              {timeOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label htmlFor="end-time" className="text-sm font-medium">
            End Time
          </label>
          <Select value={endTime} onValueChange={setEndTime}>
            <SelectTrigger id="end-time" className="w-full">
              <div className="flex items-center">
                <Clock className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Select end time" />
              </div>
            </SelectTrigger>
            <SelectContent>
              {timeOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="description" className="text-sm font-medium">
          Description
        </label>
        <Textarea
          id="description"
          placeholder="Enter event details"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="min-h-[100px]"
        />
      </div>

      <div className="flex justify-end space-x-2 pt-2">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit">
          {initialEvent ? "Update" : "Add"} Event
        </Button>
      </div>
    </form>
  );
};

export default EventForm;
