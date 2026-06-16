import { useEffect, useState } from 'react';
import { CheckSquareIcon, ChevronDownIcon, ChevronRightIcon } from 'lucide-react';
import { useSelector } from 'react-redux';
import Link from "next/link";
import {
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"
import { useSession } from '@/lib/auth-client';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

function MyTasksSidebar() {
    const { data: session } = useSession();
    const user = session?.user;

    const { currentWorkspace } = useSelector((state: any) => state.workspace);
    const [isOpen, setIsOpen] = useState(false); // Closed by default
    const [myTasks, setMyTasks] = useState([]);

    const getTaskStatusColor = (status: any) => {
        switch (status) {
            case 'DONE':
                return 'bg-success';
            case 'IN_PROGRESS':
                return 'bg-warning';
            case 'TODO':
                return 'bg-muted-foreground';
            default:
                return 'bg-muted';
        }
    };

    const fetchUserTasks = () => {
        const userId = user?.id || '';
        if (!userId || !currentWorkspace) return;
        const currentWorkspaceTasks = currentWorkspace.projects?.flatMap((project: any) => {
            return project.tasks?.filter((task: any) => task?.assigneeId === userId || task?.assignee?.id === userId) || [];
        }) || [];

        setMyTasks(currentWorkspaceTasks);
    }

    useEffect(() => {
        fetchUserTasks()
    }, [currentWorkspace, user])

    return (
        <SidebarGroup className="group-data-[collapsible=icon]:hidden">
            <Collapsible open={isOpen} onOpenChange={setIsOpen} className="w-full">
                <CollapsibleTrigger asChild>
                    <SidebarGroupLabel className="flex items-center justify-between cursor-pointer hover:text-foreground transition-colors w-full select-none">
                        <div className="flex items-center gap-1.5">
                            <span>My Tasks</span>
                            <span className="text-[10px] bg-muted px-1.5 py-0.2 rounded-full font-semibold">{myTasks.length}</span>
                        </div>
                        {isOpen ? (
                            <ChevronDownIcon className="h-3.5 w-3.5 text-muted-foreground ml-auto" />
                        ) : (
                            <ChevronRightIcon className="h-3.5 w-3.5 text-muted-foreground ml-auto" />
                        )}
                    </SidebarGroupLabel>
                </CollapsibleTrigger>
                <CollapsibleContent className="pt-1">
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {myTasks.length === 0 ? (
                                <div className="px-2 py-1.5 text-xs text-muted-foreground">
                                    No tasks assigned
                                </div>
                            ) : (
                                myTasks.map((task: any, index: number) => (
                                    <SidebarMenuItem key={index}>
                                        <SidebarMenuButton asChild>
                                            <Link href={`/tasks/${task.id}`}>
                                                <div className={`size-2 rounded-full ${getTaskStatusColor(task.status)} shrink-0 translate-x-1`} />
                                                <div className="flex flex-col gap-0.5 ml-1 overflow-hidden">
                                                    <span className="truncate">{task.title}</span>
                                                    <span className="text-[10px] text-muted-foreground lowercase truncate">
                                                        {task.status.replace('_', ' ')}
                                                    </span>
                                                </div>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                ))
                            )}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </CollapsibleContent>
            </Collapsible>
        </SidebarGroup>
    );
}

export default MyTasksSidebar;
