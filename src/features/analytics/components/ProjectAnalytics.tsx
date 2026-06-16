"use client";

import { useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Cell, Tooltip, CartesianGrid } from "recharts";
import { CheckCircle, Clock, AlertTriangle, Users, ArrowRightIcon } from "lucide-react";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

const PRIORITY_COLORS = {
    LOW: "bg-success",
    MEDIUM: "bg-info",
    HIGH: "bg-destructive",
};

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

const ProjectAnalytics = ({ project, tasks }) => {
    const { stats, statusData, typeData, priorityData } = useMemo(() => {
        const now = new Date();
        const total = tasks.length;

        const stats = {
            total,
            completed: 0,
            inProgress: 0,
            todo: 0,
            overdue: 0,
        };

        const statusMap = { TODO: 0, IN_PROGRESS: 0, DONE: 0 };
        const typeMap = { TASK: 0, BUG: 0, FEATURE: 0, IMPROVEMENT: 0, OTHER: 0 };
        const priorityMap = { LOW: 0, MEDIUM: 0, HIGH: 0 };

        tasks.forEach((t) => {
            if (t.status === "DONE") stats.completed++;
            if (t.status === "IN_PROGRESS") stats.inProgress++;
            if (t.status === "TODO") stats.todo++;
            if (new Date(t.due_date) < now && t.status !== "DONE") stats.overdue++;

            if (statusMap[t.status] !== undefined) statusMap[t.status]++;
            if (typeMap[t.type] !== undefined) typeMap[t.type]++;
            if (priorityMap[t.priority] !== undefined) priorityMap[t.priority]++;
        });

        return {
            stats,
            statusData: Object.entries(statusMap).map(([k, v]) => ({ name: k.replace("_", " "), value: v })),
            typeData: Object.entries(typeMap).filter(([_, v]) => v > 0).map(([k, v]) => ({ name: k, value: v })),
            priorityData: Object.entries(priorityMap).map(([k, v]) => ({
                name: k,
                value: v,
                percentage: total > 0 ? Math.round((v / total) * 100) : 0,
            })),
        };
    }, [tasks]);

    const completionRate = stats.total ? Math.round((stats.completed / stats.total) * 100) : 0;

    const metrics = [
        {
            label: "Completion Rate",
            value: `${completionRate}%`,
            color: "text-success",
            icon: <CheckCircle className="size-5 text-success" />,
            bg: "bg-success/10 border border-success/20",
        },
        {
            label: "Active Tasks",
            value: stats.inProgress,
            color: "text-info",
            icon: <Clock className="size-5 text-info" />,
            bg: "bg-info/10 border border-info/20",
        },
        {
            label: "Overdue Tasks",
            value: stats.overdue,
            color: "text-destructive",
            icon: <AlertTriangle className="size-5 text-destructive" />,
            bg: "bg-destructive/10 border border-destructive/20",
        },
        {
            label: "Team Size",
            value: project?.members?.length || 0,
            color: "text-primary",
            icon: <Users className="size-5 text-primary" />,
            bg: "bg-primary/10 border border-primary/20",
        },
    ];

    return (
        <div className="space-y-6">
            {/* Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {metrics.map((m, i) => (
                    <Card key={i} className="bg-card/40 dark:bg-card/20 backdrop-blur-lg border border-border/50 shadow-[0_8px_32px_0_rgba(0,0,0,0.04)] dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.2)] hover:translate-y-[-2px] transition-all duration-300">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">{m.label}</p>
                                    <p className={`text-2xl font-bold ${m.color}`}>{m.value}</p>
                                </div>
                                <div className={`p-2 rounded-md ${m.bg}`}>{m.icon}</div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Charts */}
            <div className="grid lg:grid-cols-2 gap-6">
                {/* Tasks by Status */}
                <Card className="bg-card/40 dark:bg-card/20 backdrop-blur-lg border border-border/50 shadow-[0_8px_32px_0_rgba(0,0,0,0.04)] dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.2)]">
                    <CardHeader>
                        <CardTitle className="text-base font-semibold">Tasks by Status</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
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

                {/* Tasks by Type */}
                <Card className="bg-card/40 dark:bg-card/20 backdrop-blur-lg border border-border/50 shadow-[0_8px_32px_0_rgba(0,0,0,0.04)] dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.2)]">
                    <CardHeader>
                        <CardTitle className="text-base font-semibold">Tasks by Type</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="relative flex flex-col justify-center items-center h-[300px]">
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
                                        innerRadius={70}
                                        outerRadius={92}
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
                                <span className="text-3xl font-extrabold text-foreground">{stats.total}</span>
                                <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Total Tasks</span>
                            </div>
                        </div>
                        {/* Custom Legend */}
                        <div className="flex flex-wrap justify-center gap-3 mt-4">
                            {typeData.map((entry) => {
                                let dotColor = "bg-gray-400";
                                if (entry.name === "TASK") dotColor = "bg-blue-400";
                                else if (entry.name === "BUG") dotColor = "bg-red-400";
                                else if (entry.name === "FEATURE") dotColor = "bg-purple-400";
                                else if (entry.name === "IMPROVEMENT") dotColor = "bg-emerald-400";
                                return (
                                    <div key={entry.name} className="flex items-center gap-1.5 text-[11px] font-medium bg-secondary/30 dark:bg-card/20 backdrop-blur-sm border border-border/40 px-2.5 py-1 rounded-full">
                                        <span className={`size-2 rounded-full ${dotColor}`} />
                                        <span className="capitalize">{entry.name.toLowerCase()}</span>
                                        <span className="text-muted-foreground font-normal">({entry.value})</span>
                                    </div>
                                );
                            })}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Priority Breakdown */}
            <Card className="bg-card/40 dark:bg-card/20 backdrop-blur-lg border border-border/50 shadow-[0_8px_32px_0_rgba(0,0,0,0.04)] dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.2)]">
                <CardHeader>
                    <CardTitle className="text-base font-semibold">Tasks by Priority</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {priorityData.map((p) => (
                            <div key={p.name} className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-2">
                                        <ArrowRightIcon className="size-3.5 text-muted-foreground" />
                                        <span className="capitalize text-xs font-semibold">{p.name.toLowerCase()} Priority</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs text-muted-foreground">{p.value} tasks</span>
                                        <span className="px-2 py-0.5 border border-border/60 rounded text-[10px] text-muted-foreground font-semibold">
                                            {p.percentage}%
                                        </span>
                                    </div>
                                </div>
                                <Progress value={p.percentage} className="h-2" indicatorClassName={PRIORITY_COLORS[p.name]} />
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default ProjectAnalytics;
