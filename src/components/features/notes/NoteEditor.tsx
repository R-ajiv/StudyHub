
import React, { useState, useEffect } from "react";
import { Note } from "@/contexts/AppDataContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

interface NoteEditorProps {
  note: Note | null;
  onSave: (note: Omit<Note, "id" | "createdAt" | "updatedAt">) => void;
  onUpdate: (id: string, note: Partial<Note>) => void;
  onDelete?: (id: string) => void;
  onCancel?: () => void;
}

const categories = [
  "General",
  "Lecture Notes",
  "Study Guide",
  "Research",
  "Project",
  "Homework",
  "Reading Notes",
  "Lab Notes",
  "Other"
];

const NoteEditor = ({ note, onSave, onUpdate, onDelete, onCancel }: NoteEditorProps) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("General");
  const [isEditing, setIsEditing] = useState(false);

  // Set form values when note changes
  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content);
      setCategory(note.category);
      setIsEditing(true);
    } else {
      setTitle("");
      setContent("");
      setCategory("General");
      setIsEditing(false);
    }
  }, [note]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error("Please enter a title for your note");
      return;
    }

    if (isEditing && note) {
      onUpdate(note.id, { title, content, category });
    } else {
      onSave({ title, content, category });
    }

    // Clear form if it's a new note
    if (!isEditing) {
      setTitle("");
      setContent("");
    }
  };

  const handleDelete = () => {
    if (note && onDelete) {
      onDelete(note.id);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Input
          placeholder="Note title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="text-xl font-semibold mb-2"
        />
        
        <div className="mb-4">
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Textarea
        placeholder="Write your note here..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="min-h-[300px] text-base"
      />

      <div className="flex justify-end space-x-2">
        {isEditing && onDelete && (
          <Button 
            type="button" 
            variant="destructive" 
            onClick={handleDelete}
          >
            Delete
          </Button>
        )}
        {onCancel && (
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel}
          >
            Cancel
          </Button>
        )}
        <Button type="submit">
          {isEditing ? "Update" : "Save"}
        </Button>
      </div>
    </form>
  );
};

export default NoteEditor;
