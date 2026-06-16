import { useEffect, useState } from "react";
import { ArrowRight, AlertTriangle } from "lucide-react";
import { useSelector } from "react-redux";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export default function TasksSummary() {
    const { currentWorkspace } = useSelector((state: any) => state.workspace);
    const [tasks, setTasks] = useState([]);

    // Get all tasks for all projects in current workspace
    useEffect(() => {
        if (currentWorkspace) {
            setTasks(currentWorkspace.projects?.flatMap((project) => project.tasks || []) || []);
        }
    }, [currentWorkspace]);

    const overdueTasks = tasks.filter(t => t.due_date && new Date(t.due_date) < new Date() && t.status !== 'DONE');

    return (
        <Card className="h-[380px] bg-card/40 dark:bg-card/20 backdrop-blur-lg border border-border/50 shadow-[0_8px_32px_0_rgba(0,0,0,0.04)] dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.2)] flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between border-b border-border/80 p-4 shrink-0">
                <div className="flex items-center gap-2">
                    <div className="p-2 bg-destructive/10 rounded-lg">
                        <AlertTriangle className="w-4 h-4 text-destructive" />
                    </div>
                    <CardTitle className="text-base font-semibold">
                        Overdue Tasks
                    </CardTitle>
                </div>
                <Badge variant="destructive" className="font-semibold px-2 py-0.5 text-xs">
                    {overdueTasks.length}
                </Badge>
            </CardHeader>
            <CardContent className="p-4 flex-1 overflow-hidden flex flex-col justify-between">
                {overdueTasks.length === 0 ? (
                    <div className="flex-1 flex items-center justify-center">
                        <p className="text-sm text-muted-foreground text-center py-4">
                            No overdue tasks
                        </p>
                    </div>
                ) : (
                    <div className="flex-1 flex flex-col justify-between overflow-hidden pt-1">
                        <div className="space-y-2.5 overflow-y-auto max-h-[230px] pr-1">
                            {overdueTasks.slice(0, 3).map((issue) => (
                                <div key={issue.id} className="p-2.5 rounded-lg border border-border/40 bg-secondary/20 hover:bg-secondary/40 transition-all cursor-pointer">
                                    <h4 className="text-xs font-semibold truncate mb-0.5 text-foreground">
                                        {issue.title}
                                    </h4>
                                    <p className="text-[10px] text-muted-foreground capitalize font-medium">
                                        {issue.type} • {issue.priority} priority
                                    </p>
                                </div>
                            ))}
                        </div>
                        {overdueTasks.length > 3 && (
                            <Button variant="ghost" className="w-full text-[11px] h-8 mt-2 hover:bg-secondary/40 font-medium shrink-0">
                                View {overdueTasks.length - 3} more <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                            </Button>
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
