
import React, { useState } from "react";
import LoginForm from "../auth/LoginForm";
import RegisterForm from "../auth/RegisterForm";
import { useTheme } from "@/contexts/ThemeContext";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";

const AuthLayout = () => {
  const [isLogin, setIsLogin] = useState(true);
  const { theme, toggleTheme } = useTheme();

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* Theme toggle button */}
      <div className="absolute top-4 right-4">
        <Button variant="ghost" size="icon" onClick={toggleTheme}>
          {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
        </Button>
      </div>

      <div className="hidden lg:flex flex-col justify-center items-center w-1/2 bg-primary p-8">
        <div className="max-w-md text-center text-primary-foreground">
          <h1 className="text-4xl font-bold mb-6">StudyHub</h1>
          <p className="text-xl mb-8">
            Boost your academic performance with our all-in-one productivity platform.
          </p>
          <div className="grid grid-cols-2 gap-6 mt-12">
            <div className="flex flex-col items-center p-4 bg-white/10 rounded-lg">
              <BookIcon className="h-8 w-8 mb-2 text-primary-foreground" />
              <h3 className="font-medium">Note Taking</h3>
              <p className="text-sm opacity-80">Organize your class notes</p>
            </div>
            <div className="flex flex-col items-center p-4 bg-white/10 rounded-lg">
              <TaskIcon className="h-8 w-8 mb-2 text-primary-foreground" />
              <h3 className="font-medium">Task Management</h3>
              <p className="text-sm opacity-80">Track assignments & deadlines</p>
            </div>
            <div className="flex flex-col items-center p-4 bg-white/10 rounded-lg">
              <CalendarIcon className="h-8 w-8 mb-2 text-primary-foreground" />
              <h3 className="font-medium">Calendar</h3>
              <p className="text-sm opacity-80">Plan your study schedule</p>
            </div>
            <div className="flex flex-col items-center p-4 bg-white/10 rounded-lg">
              <CloudIcon className="h-8 w-8 mb-2 text-primary-foreground" />
              <h3 className="font-medium">Sync Across Devices</h3>
              <p className="text-sm opacity-80">Access anywhere</p>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        {isLogin ? (
          <LoginForm onSwitch={toggleAuthMode} />
        ) : (
          <RegisterForm onSwitch={toggleAuthMode} />
        )}
      </div>
    </div>
  );
};

// Custom icon components
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

const TaskIcon = ({ className }: { className?: string }) => (
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
      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
    />
  </svg>
);

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

const CloudIcon = ({ className }: { className?: string }) => (
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
      d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"
    />
  </svg>
);

export default AuthLayout;
