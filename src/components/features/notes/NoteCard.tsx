
import { Note } from "@/contexts/AppDataContext";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";

interface NoteCardProps {
  note: Note;
  onClick: (note: Note) => void;
  isSelected?: boolean;
}

const NoteCard = ({ note, onClick, isSelected }: NoteCardProps) => {
  // Calculate time ago
  const timeAgo = formatDistanceToNow(new Date(note.updatedAt), { addSuffix: true });
  
  return (
    <Card 
      className={cn(
        "cursor-pointer transition-all hover:shadow-md",
        isSelected ? "border-primary ring-1 ring-primary" : "hover:border-primary/30"
      )}
      onClick={() => onClick(note)}
    >
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-medium line-clamp-1">{note.title}</h3>
          <span className="text-xs text-muted-foreground">{timeAgo}</span>
        </div>
        
        <p className="text-sm text-muted-foreground line-clamp-3 mb-3">
          {note.content}
        </p>
        
        {note.category && (
          <div className="mt-2">
            <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
              {note.category}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default NoteCard;
