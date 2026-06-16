import Link from "next/link";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Calendar, CheckSquare, Folder } from "lucide-react"
import { format } from "date-fns"

const getStatusClass = (status: any) => {
    switch (status) {
        case 'ACTIVE': return 'bg-success/15 text-success hover:bg-success/25 border-success/20';
        case 'ON_HOLD': return 'bg-warning/15 text-warning hover:bg-warning/25 border-warning/20';
        case 'COMPLETED': return 'bg-info/15 text-info hover:bg-info/25 border-info/20';
        case 'CANCELLED': return 'bg-destructive/15 text-destructive hover:bg-destructive/25 border-destructive/20';
        case 'PLANNING': return 'bg-muted text-muted-foreground hover:bg-muted/80 border-border';
        default: return '';
    }
}

const ProjectCard = ({ project }: any) => {
    const totalTasks = project.tasks?.length || 0;
    const completedTasks = project.tasks?.filter((t: any) => t.status === 'DONE').length || 0;

    return (
        <Link href={`/projects/${project.id}?tab=tasks`} className="block h-full">
            <Card className="relative overflow-hidden bg-card border border-border/80 hover:border-primary/20 dark:hover:border-primary/40 shadow-sm hover:shadow-[0_8px_30px_rgb(0,0,0,0.03)] dark:hover:shadow-[0_8px_30px_rgb(0,0,0,0.2)] transition-all duration-300 hover:-translate-y-1 h-full flex flex-col rounded-xl">

                <CardHeader className="pb-3 pt-5 px-5">
                    <div className="flex items-center gap-3">
                        {/* Project Logo Avatar */}
                        <div className="w-9 h-9 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700/50 flex items-center justify-center text-zinc-700 dark:text-zinc-300 shadow-sm flex-shrink-0">
                            <Folder className="w-4.5 h-4.5" />
                        </div>

                        {/* Title & Badge */}
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                                <CardTitle className="text-sm font-semibold truncate leading-tight text-foreground">
                                    {project.name}
                                </CardTitle>
                                <Badge variant="outline" className={`text-[10px] px-1.5 py-0 rounded-full font-medium ${getStatusClass(project.status)}`}>
                                    {project.status.replace("_", " ")}
                                </Badge>
                            </div>
                            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                                {project.priority.toLowerCase()} priority
                            </span>
                        </div>
                    </div>

                    <CardDescription className="line-clamp-2 text-xs mt-3 text-muted-foreground">
                        {project.description || "No description"}
                    </CardDescription>
                </CardHeader>

                <CardContent className="pb-4 px-5 flex-1 flex flex-col justify-end">
                    <div className="flex items-center justify-between text-xs text-muted-foreground gap-4 mt-2">
                        {/* Task completion state */}
                        <div className="flex items-center gap-1.5">
                            <CheckSquare className="w-3.5 h-3.5 text-muted-foreground/70" />
                            <span>{completedTasks}/{totalTasks} tasks</span>
                        </div>

                        {/* End date */}
                        {project.end_date && (
                            <div className="flex items-center gap-1.5">
                                <Calendar className="w-3.5 h-3.5 text-muted-foreground/70" />
                                <span>{format(new Date(project.end_date), "MMM d, yyyy")}</span>
                            </div>
                        )}
                    </div>
                </CardContent>

                <CardFooter className="flex-col items-stretch gap-3 pt-3 pb-4 px-5 border-t border-border/50 bg-accent/10">
                    <div className="flex w-full items-center justify-between">
                        {/* Stacked Member Avatars */}
                        {project.members && project.members.length > 0 ? (
                            <div className="flex items-center -space-x-1.5 overflow-hidden">
                                {project.members.slice(0, 3).map((member: any) => {
                                    const initials = member.user?.name
                                        ? member.user.name.split(' ').map((n: string) => n[0]).join('').toUpperCase().substring(0, 2)
                                        : 'U';
                                    return (
                                        <Avatar key={member.id} className="h-5 w-5 border border-card shadow-sm flex-shrink-0">
                                            <AvatarImage src={member.user?.image || ""} alt={member.user?.name || "User"} />
                                            <AvatarFallback className="text-[8px] bg-primary/15 text-primary font-bold">
                                                {initials}
                                            </AvatarFallback>
                                        </Avatar>
                                    );
                                })}
                                {project.members.length > 3 && (
                                    <div className="h-5 w-5 rounded-full bg-muted border border-card flex items-center justify-center text-[7px] font-bold text-muted-foreground shadow-sm flex-shrink-0">
                                        +{project.members.length - 3}
                                    </div>
                                )}
                            </div>
                        ) : (
                            <span className="text-[10px] text-muted-foreground">No members</span>
                        )}

                        {/* Progress percentage */}
                        <div className="text-[10px] font-semibold text-muted-foreground">
                            {project.progress || 0}%
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <Progress value={project.progress || 0} className="h-1 bg-muted" />
                </CardFooter>
            </Card>
        </Link>
    );
};

export default ProjectCard;
