"use client";

import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider } from "@/components/ui/sidebar";
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
+import Link from 'next/link';
 import { Input } from "@/components/ui/input";
 import { Textarea } from "@/components/ui/textarea";
 import { generateTrainingPlan } from "@/ai/flows/generate-training-plan";
@@ -50,6 +51,9 @@
               onChange={(e) => setPassword(e.target.value)}
             />
             <Button onClick={handleLogin}>Login</Button>
+            <p className="text-sm text-center mt-2">
+              Don't have an account? <Link href="/register" className="text-primary">Register here</Link>
+            </p>
           </CardContent>
         </Card>
       </div>
