"use client";

import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import useProject from "@/hooks/use-project";
import { cn } from "@/lib/utils";
import { Bot, CreditCard, LayoutDashboard, Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const applicationItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Q&A",
    url: "/qna",
    icon: Bot,
  },
  {
    title: "Billing",
    url: "/billing",
    icon: CreditCard,
  },
];

const AppSidebar = () => {
  const pathname = usePathname();
  const { open } = useSidebar();
  const { projects, selectedProjectId, setSelectedProjectId } = useProject();

  return (
    <Sidebar collapsible="icon" variant="floating">
      {/* TODO: Update Logo to Svg version */}
      <SidebarHeader>
        <div className="flex items-center gap-2">
          <Image src="/logo.png" alt="logo" width={40} height={40} />
          {open && (
            <h1 className="text-xl font-bold text-primary/90 dark:text-violet-500">
              Athena
            </h1>
          )}
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {applicationItems.map((item) => {
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <Link
                        href={item.url}
                        className={cn({
                          "!bg-primary !text-white": pathname === item.url,
                        })}
                      >
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Your Projects</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {projects?.map((project) => {
                return (
                  <SidebarMenuItem key={project.name}>
                    <SidebarMenuButton asChild>
                      <div
                        onClick={() => setSelectedProjectId(project.id)}
                        className={cn("cursor-pointer", {
                          "bg-primary text-white":
                            project.id === selectedProjectId,
                        })}
                      >
                        <div
                          className={cn(
                            "flex size-6 items-center justify-center rounded-sm border bg-white text-sm text-primary",
                            {
                              "bg-violet-500/80 text-white":
                                project.id === selectedProjectId,
                            },
                          )}
                        >
                          {project.name[0]}
                        </div>
                        {open && <span>{project.name}</span>}
                      </div>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}

              <div className="h-2" />
              {open && (
                <SidebarMenuItem>
                  <Link href="/create">
                    <Button variant={"outline"} className="w-full">
                      <Plus />
                      Create Project
                    </Button>
                  </Link>
                </SidebarMenuItem>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default AppSidebar;
