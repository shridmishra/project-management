import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, FolderOpen } from "lucide-react";
import { useSelector } from "react-redux";
import CreateProjectDialog from "./CreateProjectDialog";
import ProjectCard from "./ProjectCard";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const ProjectOverview = () => {
    const currentWorkspace = useSelector((state: any) => state?.workspace?.currentWorkspace || null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [projects, setProjects] = useState([]);

    useEffect(() => {
        setProjects(currentWorkspace?.projects || []);
    }, [currentWorkspace]);

    return currentWorkspace && (
        <Card className="overflow-hidden bg-card border border-border rounded-xl">
            <CardHeader className="flex flex-row items-center justify-between border-b border-border/80 p-5">
                <CardTitle className="text-sm font-semibold text-foreground">Project Overview</CardTitle>
                <Link href={'/projects'}>
                    <Button variant="ghost" className="text-xs h-auto py-1.5 px-3 rounded-lg hover:bg-accent hover:text-accent-foreground flex items-center gap-1.5 font-medium transition-colors">
                        View all <ArrowRight className="w-3.5 h-3.5" />
                    </Button>
                </Link>
            </CardHeader>

            <CardContent className="p-5">
                {projects.length === 0 ? (
                    <div className="py-12 text-center">
                        <div className="w-16 h-16 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
                            <FolderOpen className="h-7 w-7 text-muted-foreground" />
                        </div>
                        <p className="text-sm text-muted-foreground">No projects created yet</p>
                        <Button onClick={() => setIsDialogOpen(true)} className="mt-4 text-xs font-semibold py-1.5 px-4 rounded-xl">
                            Create your First Project
                        </Button>
                        <CreateProjectDialog isDialogOpen={isDialogOpen} setIsDialogOpen={setIsDialogOpen} />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {projects.slice(0, 3).map((project: any) => (
                            <ProjectCard key={project.id} project={project} />
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

export default ProjectOverview;
