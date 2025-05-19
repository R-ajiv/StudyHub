
import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

const Settings = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  
  // Initialize form with user data
  useEffect(() => {
    if (user) {
      // Get name from user metadata
      const metadata = user.user_metadata;
      const displayName = metadata?.name || metadata?.full_name || "";
      
      if (displayName && typeof displayName === 'string') {
        setName(displayName);
      }
      
      if (user.email) {
        setEmail(user.email);
      }
    }
  }, [user]);
  
  // Mock update profile function
  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    
    // In a real app, you'd call an API to update the user profile
    toast.success("Profile updated successfully");
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div>
        <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">Settings</h2>
        <p className="text-muted-foreground">
          Manage your account settings and preferences.
        </p>
      </div>

      <div className="grid gap-6">
        {/* Account Settings */}
        <Card className="glass-card border-primary/20 shadow-lg shadow-primary/5">
          <CardHeader>
            <CardTitle>Account</CardTitle>
            <CardDescription>
              Update your personal information
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-secondary/50 border-secondary"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  readOnly
                  className="bg-secondary/50 border-secondary"
                />
              </div>
              
              <Button type="submit" className="mt-2">
                Update Profile
              </Button>
            </form>
          </CardContent>
        </Card>
        
        {/* Appearance Settings */}
        <Card className="glass-card border-primary/20 shadow-lg shadow-primary/5">
          <CardHeader>
            <CardTitle>Appearance</CardTitle>
            <CardDescription>
              Customize how the app looks
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="dark-mode">Dark Mode</Label>
                <p className="text-sm text-muted-foreground">
                  Switch between light and dark themes
                </p>
              </div>
              <Switch
                id="dark-mode"
                checked={theme === "dark"}
                onCheckedChange={toggleTheme}
              />
            </div>
          </CardContent>
        </Card>
        
        {/* Notification Settings (Mock) */}
        <Card className="glass-card border-primary/20 shadow-lg shadow-primary/5">
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
            <CardDescription>
              Configure how you receive notifications
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="email-notifications">Email Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Receive notifications about your upcoming tasks and events
                </p>
              </div>
              <Switch
                id="email-notifications"
                defaultChecked
              />
            </div>
            
            <Separator className="my-4 bg-secondary/50" />
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="task-reminders">Task Reminders</Label>
                <p className="text-sm text-muted-foreground">
                  Get reminders about upcoming tasks
                </p>
              </div>
              <Switch
                id="task-reminders"
                defaultChecked
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="event-reminders">Event Reminders</Label>
                <p className="text-sm text-muted-foreground">
                  Get reminders about upcoming events
                </p>
              </div>
              <Switch
                id="event-reminders"
                defaultChecked
              />
            </div>
          </CardContent>
        </Card>
        
        {/* Danger Zone */}
        <Card className="border-destructive/40 glass-card shadow-lg shadow-destructive/5">
          <CardHeader>
            <CardTitle className="text-destructive">Danger Zone</CardTitle>
            <CardDescription>
              Irreversible account actions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col space-y-2">
              <div className="space-y-1">
                <h4 className="font-medium">Log Out</h4>
                <p className="text-sm text-muted-foreground">
                  Log out from your account
                </p>
              </div>
              <Button 
                variant="destructive" 
                onClick={logout}
              >
                Log Out
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Settings;
