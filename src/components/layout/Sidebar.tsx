
import React from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { 
  BookOpen, 
  ListCheck, 
  Calendar, 
  Settings,
  User,
  LogOut,
  Moon,
  Sun
} from "lucide-react";

interface SidebarProps {
  isMobileSidebarOpen: boolean;
  closeMobileSidebar: () => void;
}

const Sidebar = ({ isMobileSidebarOpen, closeMobileSidebar }: SidebarProps) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  // Get user display name from user metadata or email
  const getUserInitial = () => {
    if (!user) return "";
    
    // Try to get name from user metadata
    const metadata = user.user_metadata;
    const name = metadata?.name || metadata?.full_name || "";
    
    if (name && typeof name === 'string' && name.length > 0) {
      return name.charAt(0).toUpperCase();
    }
    
    // Fallback to email
    if (user && user.email && typeof user.email === 'string') {
      return user.email.charAt(0).toUpperCase();
    }
    
    return "U"; // Ultimate fallback
  };

  // Get user display name
  const getDisplayName = () => {
    if (!user) return "";
    
    // Try to get name from user metadata
    const metadata = user.user_metadata;
    const name = metadata?.name || metadata?.full_name || "";
    
    if (name && typeof name === 'string') {
      return name;
    }
    
    // Fallback to email without domain
    if (user && user.email && typeof user.email === 'string') {
      return user.email.split('@')[0];
    }
    
    return "User";
  };

  const handleLogout = () => {
    logout();
  };

  const navigation = [
    { name: "Dashboard", path: "/dashboard", icon: <User size={18} /> },
    { name: "Notes", path: "/notes", icon: <BookOpen size={18} /> },
    { name: "Tasks", path: "/tasks", icon: <ListCheck size={18} /> },
    { name: "Calendar", path: "/calendar", icon: <Calendar size={18} /> },
    { name: "Settings", path: "/settings", icon: <Settings size={18} /> },
  ];

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col w-64 border-r border-white/10 bg-sidebar-background">
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-center h-16 px-4 border-b border-white/10">
            <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">StudyHub</h1>
          </div>

          <nav className="flex-1 px-2 py-4 space-y-1">
            {navigation.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  cn(
                    "sidebar-link",
                    isActive
                      ? "sidebar-link-active"
                      : "sidebar-link-inactive"
                  )
                }
              >
                <span className="mr-3">{item.icon}</span>
                {item.name}
              </NavLink>
            ))}
          </nav>

          <div className="p-4 border-t border-white/10">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="h-8 w-8 rounded-full bg-primary/80 flex items-center justify-center text-primary-foreground">
                  {getUserInitial()}
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium">{getDisplayName()}</span>
                  <span className="text-xs text-muted-foreground truncate max-w-[140px]">
                    {user?.email || ""}
                  </span>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={toggleTheme}>
                {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
              </Button>
            </div>
            
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full flex items-center justify-center border-white/10 hover:bg-white/5"
              onClick={handleLogout}
            >
              <LogOut size={16} className="mr-2" />
              Sign out
            </Button>
          </div>
        </div>
      </aside>

      {/* Mobile sidebar */}
      <div
        className={cn(
          "fixed inset-0 z-40 md:hidden bg-background/80 backdrop-blur-sm transition-opacity",
          isMobileSidebarOpen 
            ? "opacity-100" 
            : "opacity-0 pointer-events-none"
        )}
        onClick={closeMobileSidebar}
      />

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-sidebar-background transform transition-transform duration-300 ease-in-out md:hidden border-r border-white/10",
          isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-center h-16 px-4 border-b border-white/10">
            <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">StudyHub</h1>
          </div>

          <nav className="flex-1 px-2 py-4 space-y-1">
            {navigation.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                onClick={closeMobileSidebar}
                className={({ isActive }) =>
                  cn(
                    "sidebar-link",
                    isActive
                      ? "sidebar-link-active"
                      : "sidebar-link-inactive"
                  )
                }
              >
                <span className="mr-3">{item.icon}</span>
                {item.name}
              </NavLink>
            ))}
          </nav>

          <div className="p-4 border-t border-white/10">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="h-8 w-8 rounded-full bg-primary/80 flex items-center justify-center text-primary-foreground">
                  {getUserInitial()}
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium">{getDisplayName()}</span>
                  <span className="text-xs text-muted-foreground truncate max-w-[140px]">
                    {user?.email || ""}
                  </span>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={toggleTheme}>
                {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
              </Button>
            </div>
            
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full flex items-center justify-center border-white/10 hover:bg-white/5"
              onClick={handleLogout}
            >
              <LogOut size={16} className="mr-2" />
              Sign out
            </Button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
