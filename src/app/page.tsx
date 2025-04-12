"use client";

import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider } from "@/components/ui/sidebar";
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

// Define roles
type Role = "supervisor" | "employee";

export default function Home() {
  const [role, setRole] = useState<Role>("supervisor"); // Default role

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
          </SidebarFooter>
        </Sidebar>
        <div className="flex-1 p-4">
          <MainContent role={role} />
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
  return (
    <div>
      <h3>Welcome Supervisor!</h3>
      <p>Here you can generate, review, and assign training plans.</p>
    </div>
  );
}

function EmployeeDashboard() {
  return (
    <div>
      <h3>Welcome Employee!</h3>
      <p>Here you can follow your personalized training plan and track your progress.</p>
    </div>
  );
}
