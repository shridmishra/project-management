'use client';
export const dynamic = "force-dynamic";

import { Plus } from 'lucide-react'
import { useState, useEffect, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Cell, Tooltip, CartesianGrid } from 'recharts'
import StatsGrid from '@/features/analytics/components/StatsGrid'
import ProjectOverview from '@/features/projects/components/ProjectOverview'
import TasksSummary from '@/features/tasks/components/TasksSummary'
import CreateProjectDialog from '@/features/projects/components/CreateProjectDialog'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: any[]; label?: string }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-card/90 dark:bg-black/80 backdrop-blur-md border border-border/50 p-3 rounded-lg shadow-xl text-xs flex flex-col gap-1.5">
                {label && (
                    <p className="font-semibold text-foreground capitalize border-b border-border/30 pb-1 mb-0.5">
                        {label}
                    </p>
                )}
                {payload.map((item, index) => {
                    const name = item.name === "value" ? "Tasks" : item.name;
                    let color = item.color;
                    if (color && color.startsWith("url")) {
                        if (color.includes("todo")) color = "var(--warning)";
                        else if (color.includes("inProgress")) color = "var(--info)";
                        else if (color.includes("done")) color = "var(--success)";
                        else if (color.includes("Task")) color = "#60a5fa";
                        else if (color.includes("Bug")) color = "#f87171";
                        else if (color.includes("Feature")) color = "#c084fc";
                        else if (color.includes("Improvement")) color = "#34d399";
                        else color = "var(--primary)";
                    }
                    return (
                        <p key={index} className="text-muted-foreground flex items-center gap-2">
                            <span className="size-2 rounded-full shrink-0" style={{ backgroundColor: color || 'var(--primary)' }} />
                            <span className="font-medium">{name}:</span>
                            <span className="text-foreground font-bold">{item.value}</span>
                        </p>
                    );
                })}
            </div>
        );
    }
    return null;
};

const Dashboard = () => {
    const user = { fullName: 'User' }
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [mounted, setMounted] = useState(false)

    const currentWorkspace = useSelector(
        (state: any) => state?.workspace?.currentWorkspace || null
    );

    const projects = currentWorkspace?.projects || [];
    const allTasks = useMemo(() => {
        return projects.flatMap((p: any) => p.tasks || []);
    }, [projects]);

    const { statusData, typeData, totalTasks } = useMemo(() => {
        const statusMap = { TODO: 0, IN_PROGRESS: 0, DONE: 0 };
        const typeMap = { TASK: 0, BUG: 0, FEATURE: 0, IMPROVEMENT: 0, OTHER: 0 };

        allTasks.forEach((t: any) => {
            if (statusMap[t.status] !== undefined) statusMap[t.status]++;
            if (typeMap[t.type] !== undefined) typeMap[t.type]++;
        });

        return {
            statusData: Object.entries(statusMap).map(([k, v]) => ({ name: k.replace("_", " "), value: v })),
            typeData: Object.entries(typeMap).filter(([_, v]) => v > 0).map(([k, v]) => ({ name: k, value: v })),
            totalTasks: allTasks.length,
        };
    }, [allTasks]);

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) return null;

    return (
        <div className='max-w-7xl mx-auto space-y-6 pt-0 pb-8'>
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                <div>
                    <h1 className="text-xl sm:text-2xl font-semibold text-foreground mb-1"> Welcome back, {user?.fullName || 'User'} </h1>
                    <p className="text-muted-foreground text-sm"> Here's what's happening with your projects today </p>
                </div>

                <Button onClick={() => setIsDialogOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" /> New Project
                </Button>

                <CreateProjectDialog isDialogOpen={isDialogOpen} setIsDialogOpen={setIsDialogOpen} />
            </div>

            <StatsGrid />

            {/* Bento Grid Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* 1. Projects Overview Card (Spans all 3 columns) */}
                <div className="lg:col-span-3">
                    <ProjectOverview />
                </div>

                {/* 2. Tasks by Status Bar Chart Card (col-span-1) */}
                <div className="lg:col-span-1">
                    <Card className="h-[380px] bg-card/40 dark:bg-card/20 backdrop-blur-lg border border-border/50 shadow-[0_8px_32px_0_rgba(0,0,0,0.04)] dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.2)] flex flex-col justify-between">
                        <CardHeader className="p-4 border-b border-border/80 pb-2 shrink-0">
                            <CardTitle className="text-base font-semibold">Workspace Tasks by Status</CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 flex-1 flex items-center justify-center">
                            <ResponsiveContainer width="100%" height={240}>
                                <BarChart data={statusData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="todoGrad" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="var(--warning)" stopOpacity={0.85}/>
                                            <stop offset="100%" stopColor="var(--warning)" stopOpacity={0.15}/>
                                        </linearGradient>
                                        <linearGradient id="inProgressGrad" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="var(--info)" stopOpacity={0.85}/>
                                            <stop offset="100%" stopColor="var(--info)" stopOpacity={0.15}/>
                                        </linearGradient>
                                        <linearGradient id="doneGrad" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="var(--success)" stopOpacity={0.85}/>
                                            <stop offset="100%" stopColor="var(--success)" stopOpacity={0.15}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(120, 120, 120, 0.08)" />
                                    <XAxis
                                        dataKey="name"
                                        tick={{ fill: "var(--muted-foreground)", fontSize: 12, fontWeight: 500 }}
                                        axisLine={false}
                                        tickLine={false}
                                    />
                                    <YAxis 
                                        tick={{ fill: "var(--muted-foreground)", fontSize: 12 }} 
                                        axisLine={false}
                                        tickLine={false}
                                    />
                                    <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(120, 120, 120, 0.05)" }} />
                                    <Bar dataKey="value" maxBarSize={45} radius={[6, 6, 0, 0]}>
                                        {statusData.map((entry, index) => {
                                            let gradId = "inProgressGrad";
                                            if (entry.name === "TODO") gradId = "todoGrad";
                                            else if (entry.name === "DONE") gradId = "doneGrad";
                                            return <Cell key={`cell-${index}`} fill={`url(#${gradId})`} />;
                                        })}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </div>

                {/* 3. Tasks by Type Donut Chart Card (col-span-1) */}
                <div className="lg:col-span-1">
                    <Card className="h-[380px] bg-card/40 dark:bg-card/20 backdrop-blur-lg border border-border/50 shadow-[0_8px_32px_0_rgba(0,0,0,0.04)] dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.2)] flex flex-col justify-between">
                        <CardHeader className="p-4 border-b border-border/80 pb-2 shrink-0">
                            <CardTitle className="text-base font-semibold">Workspace Tasks by Type</CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 flex-1 flex flex-col justify-between">
                            <div className="relative flex flex-col justify-center items-center h-[200px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <defs>
                                            <linearGradient id="typeTaskGrad" x1="0" y1="0" x2="1" y2="1">
                                                <stop offset="0%" stopColor="#60a5fa" stopOpacity={0.85}/>
                                                <stop offset="100%" stopColor="#2563eb" stopOpacity={0.25}/>
                                            </linearGradient>
                                            <linearGradient id="typeBugGrad" x1="0" y1="0" x2="1" y2="1">
                                                <stop offset="0%" stopColor="#f87171" stopOpacity={0.85}/>
                                                <stop offset="100%" stopColor="#dc2626" stopOpacity={0.25}/>
                                            </linearGradient>
                                            <linearGradient id="typeFeatureGrad" x1="0" y1="0" x2="1" y2="1">
                                                <stop offset="0%" stopColor="#c084fc" stopOpacity={0.85}/>
                                                <stop offset="100%" stopColor="#7c3aed" stopOpacity={0.25}/>
                                            </linearGradient>
                                            <linearGradient id="typeImprovementGrad" x1="0" y1="0" x2="1" y2="1">
                                                <stop offset="0%" stopColor="#34d399" stopOpacity={0.85}/>
                                                <stop offset="100%" stopColor="#059669" stopOpacity={0.25}/>
                                            </linearGradient>
                                            <linearGradient id="typeOtherGrad" x1="0" y1="0" x2="1" y2="1">
                                                <stop offset="0%" stopColor="#9ca3af" stopOpacity={0.85}/>
                                                <stop offset="100%" stopColor="#4b5563" stopOpacity={0.25}/>
                                            </linearGradient>
                                        </defs>
                                        <Pie
                                            data={typeData}
                                            dataKey="value"
                                            nameKey="name"
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={55}
                                            outerRadius={75}
                                            paddingAngle={4}
                                            cornerRadius={6}
                                        >
                                            {typeData.map((entry, i) => {
                                                let gradId = "typeOtherGrad";
                                                if (entry.name === "TASK") gradId = "typeTaskGrad";
                                                else if (entry.name === "BUG") gradId = "typeBugGrad";
                                                else if (entry.name === "FEATURE") gradId = "typeFeatureGrad";
                                                else if (entry.name === "IMPROVEMENT") gradId = "typeImprovementGrad";
                                                return <Cell key={i} fill={`url(#${gradId})`} stroke="rgba(255,255,255,0.05)" />;
                                            })}
                                        </Pie>
                                        <Tooltip content={<CustomTooltip />} />
                                    </PieChart>
                                </ResponsiveContainer>
                                <div className="absolute flex flex-col items-center justify-center pointer-events-none">
                                    <span className="text-2xl font-extrabold text-foreground">{totalTasks}</span>
                                    <span className="text-[9px] uppercase tracking-wider text-muted-foreground font-semibold">Total Tasks</span>
                                </div>
                            </div>
                            {/* Custom Legend */}
                            <div className="flex flex-wrap justify-center gap-1.5 mt-2">
                                {typeData.map((entry) => {
                                    let dotColor = "bg-gray-400";
                                    if (entry.name === "TASK") dotColor = "bg-blue-400";
                                    else if (entry.name === "BUG") dotColor = "bg-red-400";
                                    else if (entry.name === "FEATURE") dotColor = "bg-purple-400";
                                    else if (entry.name === "IMPROVEMENT") dotColor = "bg-emerald-400";
                                    return (
                                        <div key={entry.name} className="flex items-center gap-1 text-[9px] font-medium bg-secondary/30 dark:bg-card/25 backdrop-blur-sm border border-border/40 px-2 py-0.5 rounded-full">
                                            <span className={`size-1.5 rounded-full ${dotColor}`} />
                                            <span className="capitalize">{entry.name.toLowerCase()}</span>
                                            <span className="text-muted-foreground font-normal">({entry.value})</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* 4. Tasks Summary Card (col-span-1) */}
                <div className="lg:col-span-1">
                    <TasksSummary />
                </div>
            </div>
        </div>
    )
}

export default Dashboard
