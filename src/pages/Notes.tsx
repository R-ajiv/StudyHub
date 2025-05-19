
import React, { useState } from "react";
import { useAppData, Note } from "@/contexts/AppDataContext";
import NoteCard from "@/components/features/notes/NoteCard";
import NoteEditor from "@/components/features/notes/NoteEditor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";

const Notes = () => {
  const { notes, addNote, updateNote, deleteNote } = useAppData();
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showMobileEditor, setShowMobileEditor] = useState(false);
  const isMobile = useIsMobile();
  
  // Handle note creation
  const handleCreateNote = () => {
    setSelectedNote(null);
    setIsCreating(true);
    if (isMobile) {
      setShowMobileEditor(true);
    }
  };
  
  // Handle note selection
  const handleSelectNote = (note: Note) => {
    setSelectedNote(note);
    setIsCreating(false);
    if (isMobile) {
      setShowMobileEditor(true);
    }
  };
  
  // Handle note save
  const handleSaveNote = (note: Omit<Note, "id" | "createdAt" | "updatedAt">) => {
    addNote(note);
    toast.success("Note created");
    setIsCreating(false);
    if (isMobile) {
      setShowMobileEditor(false);
    }
  };
  
  // Handle note update
  const handleUpdateNote = (id: string, note: Partial<Note>) => {
    updateNote(id, note);
    toast.success("Note updated");
    if (isMobile) {
      setShowMobileEditor(false);
    }
  };
  
  // Handle note deletion
  const handleDeleteNote = (id: string) => {
    deleteNote(id);
    setSelectedNote(null);
    toast.success("Note deleted");
    if (isMobile) {
      setShowMobileEditor(false);
    }
  };
  
  // Close mobile editor
  const handleCloseMobileEditor = () => {
    setShowMobileEditor(false);
    setIsCreating(false);
  };
  
  // Get all unique categories
  const categories = [...new Set(notes.map(note => note.category))].sort();
  
  // Filter notes based on search query and category
  const filteredNotes = notes.filter(note => {
    const matchesSearch = searchQuery
      ? note.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        note.content.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
    
    const matchesCategory = selectedCategory 
      ? note.category === selectedCategory 
      : true;
    
    return matchesSearch && matchesCategory;
  }).sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Notes</h2>
          <p className="text-muted-foreground">
            Manage your study notes and research materials.
          </p>
        </div>
        <Button onClick={handleCreateNote}>
          <Plus className="mr-2 h-4 w-4" /> New Note
        </Button>
      </div>
      
      <div className="flex flex-col md:flex-row gap-4">
        <div className="md:w-1/4">
          <div className="flex items-center mb-4 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="mb-4">
            <h3 className="font-medium mb-2">Categories</h3>
            <div className="space-y-1">
              <button
                className={`w-full text-left px-3 py-2 rounded-md ${
                  selectedCategory === null ? "bg-primary text-primary-foreground" : "hover:bg-accent"
                }`}
                onClick={() => setSelectedCategory(null)}
              >
                All Notes ({notes.length})
              </button>
              {categories.map((category) => (
                <button
                  key={category}
                  className={`w-full text-left px-3 py-2 rounded-md ${
                    selectedCategory === category ? "bg-primary text-primary-foreground" : "hover:bg-accent"
                  }`}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category} ({notes.filter(note => note.category === category).length})
                </button>
              ))}
            </div>
          </div>
        </div>
        
        <div className={`${isMobile ? "w-full" : "w-3/4"} space-y-6`}>
          {filteredNotes.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 gap-4">
              {filteredNotes.map((note) => (
                <NoteCard
                  key={note.id}
                  note={note}
                  onClick={handleSelectNote}
                  isSelected={selectedNote?.id === note.id}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-center p-8 border rounded-lg">
              <BookIcon className="h-12 w-12 text-muted-foreground mb-4" />
              {searchQuery || selectedCategory ? (
                <>
                  <h3 className="text-lg font-semibold mb-2">No matching notes</h3>
                  <p className="text-muted-foreground mb-4">
                    Try adjusting your search or category filter
                  </p>
                  <div className="flex gap-2">
                    {searchQuery && (
                      <Button variant="outline" onClick={() => setSearchQuery("")}>
                        Clear Search
                      </Button>
                    )}
                    {selectedCategory && (
                      <Button variant="outline" onClick={() => setSelectedCategory(null)}>
                        Clear Category
                      </Button>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <h3 className="text-lg font-semibold mb-2">No notes yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Create your first note to get started
                  </p>
                  <Button onClick={handleCreateNote}>
                    <Plus className="mr-2 h-4 w-4" /> Create Note
                  </Button>
                </>
              )}
            </div>
          )}
          
          {/* Note Editor (desktop) */}
          {!isMobile && (selectedNote || isCreating) && (
            <Dialog open={true} onOpenChange={() => {
              setSelectedNote(null);
              setIsCreating(false);
            }}>
              <DialogContent className="sm:max-w-[600px]">
                <DialogTitle>
                  {isCreating ? "Create Note" : "Edit Note"}
                </DialogTitle>
                <NoteEditor
                  note={selectedNote}
                  onSave={handleSaveNote}
                  onUpdate={handleUpdateNote}
                  onDelete={handleDeleteNote}
                  onCancel={() => {
                    setSelectedNote(null);
                    setIsCreating(false);
                  }}
                />
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>
      
      {/* Mobile Note Editor */}
      {isMobile && (
        <Sheet open={showMobileEditor} onOpenChange={setShowMobileEditor}>
          <SheetContent side="bottom" className="h-[80vh] sm:max-w-none pt-10">
            <SheetHeader>
              <SheetTitle>{isCreating ? "Create Note" : "Edit Note"}</SheetTitle>
            </SheetHeader>
            <div className="mt-4">
              <NoteEditor
                note={selectedNote}
                onSave={handleSaveNote}
                onUpdate={handleUpdateNote}
                onDelete={handleDeleteNote}
                onCancel={handleCloseMobileEditor}
              />
            </div>
          </SheetContent>
        </Sheet>
      )}
    </div>
  );
};

// Book icon component
const BookIcon = ({ className }: { className?: string }) => (
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
      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
    />
  </svg>
);

export default Notes;
