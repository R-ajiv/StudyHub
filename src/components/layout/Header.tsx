
import React from "react";
import { useLocation } from "react-router-dom";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  openMobileSidebar: () => void;
}

const Header = ({ openMobileSidebar }: HeaderProps) => {
  const location = useLocation();
  
  const getPageTitle = () => {
    const path = location.pathname;
    
    if (path.includes("/dashboard")) return "Dashboard";
    if (path.includes("/notes")) return "Notes";
    if (path.includes("/tasks")) return "Tasks";
    if (path.includes("/calendar")) return "Calendar";
    if (path.includes("/settings")) return "Settings";
    
    return "StudyHub";
  };
  
  return (
    <header className="h-16 border-b border-app-gold-500/20 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center justify-between h-full px-4">
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={openMobileSidebar}
          >
            <Menu size={20} />
          </Button>
          <h1 className="text-xl font-semibold gold-gradient-text">{getPageTitle()}</h1>
        </div>
      </div>
    </header>
  );
};

export default Header;
