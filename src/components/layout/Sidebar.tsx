"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useSelector } from "react-redux";
import MyTasksSidebar from '@/features/tasks/components/MyTasksSidebar'
import WorkspaceDropdown from '@/features/workspaces/components/WorkspaceDropdown'
import {
    FolderOpenIcon,
    LayoutDashboardIcon,
    SettingsIcon,
    UsersIcon,
    ChevronRightIcon,
    SettingsIcon as SettingsIconLucide,
    KanbanIcon,
    ChartColumnIcon,
    CalendarIcon
} from 'lucide-react'
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
    SidebarRail,
    SidebarTrigger,
    useSidebar,
    SidebarMenuSub,
    SidebarMenuSubItem,
    SidebarMenuSubButton,
} from "@/components/ui/sidebar"
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible"

const AppSidebar = () => {
    const { open } = useSidebar();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const menuItems = [
        { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboardIcon },
        { name: 'Projects', href: '/projects', icon: FolderOpenIcon },
        { name: 'Team', href: '/team', icon: UsersIcon },
    ]

    const projects = useSelector(
        (state: any) => state?.workspace?.currentWorkspace?.projects || []
    );

    const [expandedProjects, setExpandedProjects] = useState<Set<string>>(new Set());

    const getProjectSubItems = (projectId: any) => [
        { title: 'Tasks', icon: KanbanIcon, url: `/projects/${projectId}?tab=tasks` },
        { title: 'Analytics', icon: ChartColumnIcon, url: `/projects/${projectId}?tab=analytics` },
        { title: 'Calendar', icon: CalendarIcon, url: `/projects/${projectId}?tab=calendar` },
        { title: 'Settings', icon: SettingsIconLucide, url: `/projects/${projectId}?tab=settings` }
    ];

    const toggleProject = (id: string) => {
        const newSet = new Set(expandedProjects);
        newSet.has(id) ? newSet.delete(id) : newSet.add(id);
        setExpandedProjects(newSet);
    };

    useEffect(() => {
        if (projects.length > 0) {
            setExpandedProjects(prev => {
                const newSet = new Set(prev);
                const exampleProject = projects.find((p: any) => p.name === "Example Project");
                if (exampleProject) {
                    newSet.add(exampleProject.id);
                }
                projects.forEach((project: any) => {
                    if (pathname.startsWith(`/projects/${project.id}`)) {
                        newSet.add(project.id);
                    }
                });
                return newSet;
            });
        }
    }, [projects, pathname]);

    const isLinkActive = (href: string) => {
        if (href === '/dashboard') return pathname === '/dashboard';
        return pathname.startsWith(href);
    };

    return (
        <Sidebar collapsible="icon">
            <SidebarHeader>
                <div className="flex items-center justify-between gap-2">
                    <WorkspaceDropdown />
                    {open && <SidebarTrigger />}
                </div>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Application</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {menuItems.map((item) => (
                                <SidebarMenuItem key={item.name}>
                                    {item.name === 'Projects' ? (
                                        <Collapsible defaultOpen className="group/collapsible w-full">
                                            <CollapsibleTrigger asChild>
                                                <SidebarMenuButton tooltip={item.name} isActive={pathname === '/projects' || (pathname.startsWith('/projects') && !projects.some(p => pathname.startsWith(`/projects/${p.id}`)))}>
                                                    <item.icon />
                                                    <span>{item.name}</span>
                                                    <ChevronRightIcon className="ml-auto h-4 w-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                                                </SidebarMenuButton>
                                            </CollapsibleTrigger>
                                            <CollapsibleContent className="pt-1">
                                                <SidebarMenuSub>
                                                    {projects.map((project: any) => (
                                                        <SidebarMenuSubItem key={project.id}>
                                                            <Collapsible
                                                                open={expandedProjects.has(project.id)}
                                                                onOpenChange={() => toggleProject(project.id)}
                                                                className="group/project-collapsible w-full"
                                                            >
                                                                <CollapsibleTrigger asChild>
                                                                    <SidebarMenuSubButton isActive={pathname.startsWith(`/projects/${project.id}`)} className="cursor-pointer">
                                                                        <div className="flex size-1.5 shrink-0 rounded-full bg-primary mr-1" />
                                                                        <span className="truncate">{project.name}</span>
                                                                        <ChevronRightIcon className="ml-auto h-3 w-3 transition-transform duration-200 group-data-[state=open]/project-collapsible:rotate-90" />
                                                                    </SidebarMenuSubButton>
                                                                </CollapsibleTrigger>
                                                                <CollapsibleContent>
                                                                    <ul className="pl-4 mt-1 space-y-1 border-l border-border/60 ml-2.5">
                                                                        {getProjectSubItems(project.id).map((subItem: any) => {
                                                                            const isActive = pathname === `/projects/${project.id}` && searchParams.get('tab') === subItem.title.toLowerCase();
                                                                            return (
                                                                                <li key={subItem.title}>
                                                                                    <Link href={subItem.url} className={`flex items-center gap-2 px-2 py-1 text-xs rounded-md transition-colors ${isActive ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium' : 'text-muted-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-foreground'}`}>
                                                                                        <subItem.icon className="h-3 w-3" />
                                                                                        <span>{subItem.title}</span>
                                                                                    </Link>
                                                                                </li>
                                                                            );
                                                                        })}
                                                                    </ul>
                                                                </CollapsibleContent>
                                                            </Collapsible>
                                                        </SidebarMenuSubItem>
                                                    ))}
                                                </SidebarMenuSub>
                                            </CollapsibleContent>
                                        </Collapsible>
                                    ) : (
                                        <SidebarMenuButton asChild isActive={isLinkActive(item.href)}>
                                            <Link href={item.href}>
                                                <item.icon />
                                                <span>{item.name}</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    )}
                                </SidebarMenuItem>
                            ))}
                            <SidebarMenuItem>
                                <SidebarMenuButton asChild isActive={pathname.startsWith("/settings")}>
                                    <Link href="/settings">
                                        <SettingsIcon />
                                        <span>Settings</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                <MyTasksSidebar />
            </SidebarContent>
            <SidebarRail />
        </Sidebar>
    )
}

export default AppSidebar;
