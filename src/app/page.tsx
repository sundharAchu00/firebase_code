"use client";

import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider } from "@/components/ui/sidebar";
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { generateTrainingPlan } from "@/ai/flows/generate-training-plan";
import { summarizeFeedback } from "@/ai/flows/summarize-feedback";

// Define roles
type Role = "supervisor" | "employee";

export default function Home() {
  const [role, setRole] = useState<Role | null>(null); // Default role
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    // Basic authentication logic (replace with secure authentication)
    if (username === "supervisor" && password === "supervisor") {
      setRole("supervisor");
      setIsLoggedIn(true);
    } else if (username === "employee" && password === "employee") {
      setRole("employee");
      setIsLoggedIn(true);
    } else {
      alert("Invalid credentials");
    }
  };

  const handleLogout = () => {
    setRole(null);
    setIsLoggedIn(false);
  };

  useEffect(() => {
    // Check if the user is already logged in (e.g., from a cookie)
    // and set the role accordingly
  }, []);

  if (!isLoggedIn) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Card className="w-96">
          <CardHeader>
            <CardTitle>Login</CardTitle>
            <CardDescription>Enter your credentials to continue.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button onClick={handleLogin}>Login</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        <Sidebar>
          <SidebarHeader>
            <h2>RoleWise</h2>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton isActive={role === "supervisor"} onClick={() => setRole("supervisor")}>
                  Supervisor
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton isActive={role === "employee"} onClick={() => setRole("employee")}>
                  Employee
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter>
            <p className="text-center text-sm">
              {role === "supervisor" ? "Supervisor Dashboard" : "Employee Dashboard"}
            </p>
            <Button variant="outline" onClick={handleLogout}>Logout</Button>
          </SidebarFooter>
        </Sidebar>
        <div className="flex-1 p-4">
          {role ? (
            <MainContent role={role} />
          ) : (
            <p>Select a role from the sidebar.</p>
          )}
        </div>
      </div>
    </SidebarProvider>
  );
}

interface MainContentProps {
  role: Role;
}

function MainContent({ role }: MainContentProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {role === "supervisor" ? "Supervisor View" : "Employee View"}
        </CardTitle>
        <CardDescription>
          {role === "supervisor"
            ? "Manage training plans and employee transitions."
            : "Follow your personalized training plan."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {role === "supervisor" ? (
          <SupervisorDashboard />
        ) : (
          <EmployeeDashboard />
        )}
      </CardContent>
    </Card>
  );
}

function SupervisorDashboard() {
  const [employeeFeedback, setEmployeeFeedback] = useState("");
  const [newJobDescription, setNewJobDescription] = useState("");
  const [trainingPlan, setTrainingPlan] = useState("");
  const [feedbackSummary, setFeedbackSummary] = useState("");
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<string[]>([]);

  const handleGenerateTrainingPlan = async () => {
    const result = await generateTrainingPlan({
      employeeFeedback,
      newJobDescription,
    });
    setTrainingPlan(result?.trainingPlan || "Failed to generate training plan.");
  };

  const handleSummarizeFeedback = async () => {
    const result = await summarizeFeedback({ employeeFeedback });
    setFeedbackSummary(result?.summary || "Failed to summarize feedback.");
  };

  const handleChatSubmit = () => {
    if (chatInput.trim() !== "") {
      setChatMessages([...chatMessages, `Supervisor: ${chatInput}`]);
      // Here you would add logic to send the chat input to an AI model
      // and update the chat messages with the AI's response.
      setChatInput(""); // Clear the input after sending
    }
  };

  return (
    <div>
      <h3>Welcome Supervisor!</h3>
      <p>Here you can generate, review, and assign training plans.</p>

      <div className="space-y-4">
        <div>
          <h4>Employee Feedback</h4>
          <Textarea
            placeholder="Paste employee feedback here"
            value={employeeFeedback}
            onChange={(e) => setEmployeeFeedback(e.target.value)}
          />
          <Button onClick={handleSummarizeFeedback}>Summarize Feedback</Button>
          {feedbackSummary && <p>Feedback Summary: {feedbackSummary}</p>}
        </div>

        <div>
          <h4>New Job Description</h4>
          <Textarea
            placeholder="Paste the new job description here"
            value={newJobDescription}
            onChange={(e) => setNewJobDescription(e.target.value)}
          />
        </div>

        <Button onClick={handleGenerateTrainingPlan}>Generate Training Plan</Button>

        {trainingPlan && (
          <div>
            <h4>Generated Training Plan</h4>
            <Textarea
              readOnly
              value={trainingPlan}
              placeholder="Training plan will appear here"
            />
          </div>
        )}

        <div>
          <h4>Chat Interface</h4>
          <div className="space-y-2">
            {chatMessages.map((message, index) => (
              <p key={index}>{message}</p>
            ))}
          </div>
          <div className="flex space-x-2">
            <Input
              type="text"
              placeholder="Enter your message"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
            />
            <Button onClick={handleChatSubmit}>Send</Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function EmployeeDashboard() {
  const [trainingPlan, setTrainingPlan] = useState("");
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<string[]>([]);

  const handleChatSubmit = () => {
    if (chatInput.trim() !== "") {
      setChatMessages([...chatMessages, `Employee: ${chatInput}`]);
      // Here you would add logic to send the chat input to an AI model
      // and update the chat messages with the AI's response.
      setChatInput(""); // Clear the input after sending
    }
  };

  useEffect(() => {
    // Fetch the training plan for the employee
    // For simplicity, we'll use a placeholder
    setTrainingPlan("Welcome to your personalized training plan!");
  }, []);

  return (
    <div>
      <h3>Welcome Employee!</h3>
      <p>Here you can follow your personalized training plan and track your progress.</p>

      {trainingPlan && (
        <div>
          <h4>Your Training Plan</h4>
          <Textarea
            readOnly
            value={trainingPlan}
            placeholder="Your training plan will appear here"
          />
        </div>
      )}

      <div>
        <h4>Chat Interface</h4>
        <div className="space-y-2">
          {chatMessages.map((message, index) => (
            <p key={index}>{message}</p>
          ))}
        </div>
        <div className="flex space-x-2">
          <Input
            type="text"
            placeholder="Enter your message"
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
          />
          <Button onClick={handleChatSubmit}>Send</Button>
        </div>
      </div>
    </div>
  );
}
