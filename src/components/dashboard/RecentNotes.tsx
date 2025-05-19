
import { useAppData, Note } from "@/contexts/AppDataContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import { BookOpen, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const RecentNotes = () => {
  const { notes } = useAppData();
  const navigate = useNavigate();
  
  const recentNotes = [...notes]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 3);

  return (
    <Card className="col-span-12 lg:col-span-6">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl font-semibold">Recent Notes</CardTitle>
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-primary"
          onClick={() => navigate("/notes")}
        >
          View all <ArrowRight className="ml-1 h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        {recentNotes.length > 0 ? (
          <div className="space-y-4">
            {recentNotes.map((note) => (
              <NotePreview key={note.id} note={note} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-40 text-center">
            <BookOpen size={36} className="text-muted-foreground mb-2" />
            <h3 className="font-medium">No notes yet</h3>
            <p className="text-sm text-muted-foreground">
              Create your first note to see it here
            </p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => navigate("/notes")}
            >
              Create Note
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

interface NotePreviewProps {
  note: Note;
}

const NotePreview = ({ note }: NotePreviewProps) => {
  const navigate = useNavigate();
  
  const handleClick = () => {
    navigate(`/notes/${note.id}`);
  };
  
  // Calculate time ago
  const timeAgo = formatDistanceToNow(new Date(note.updatedAt), { addSuffix: true });

  return (
    <div 
      className="p-4 border rounded-md cursor-pointer hover:bg-accent/50 transition-colors"
      onClick={handleClick}
    >
      <div className="flex items-start justify-between mb-2">
        <h3 className="font-medium line-clamp-1">{note.title}</h3>
        <span className="text-xs text-muted-foreground">{timeAgo}</span>
      </div>
      <p className="text-sm text-muted-foreground line-clamp-2">
        {note.content}
      </p>
      {note.category && (
        <div className="mt-2">
          <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
            {note.category}
          </span>
        </div>
      )}
    </div>
  );
};

export default RecentNotes;
