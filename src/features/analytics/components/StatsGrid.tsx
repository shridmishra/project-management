"use client";

import { FolderOpen, CheckCircle, Users, AlertTriangle, Activity, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Card, CardContent } from "@/components/ui/card";
import { AreaChart, Area, ResponsiveContainer } from "recharts";

export default function StatsGrid() {
    const currentWorkspace = useSelector(
        (state: any) => state?.workspace?.currentWorkspace || null
    );

    const [stats, setStats] = useState({
        totalProjects: 0,
        activeProjects: 0,
        completedProjects: 0,
        myTasks: 0,
        overdueIssues: 0,
        completionRate: 0,
        activeMembers: 0,
    });

    useEffect(() => {
        if (currentWorkspace) {
            const projects = currentWorkspace.projects || [];
            const completedCount = projects.filter((p: any) => p.status === "COMPLETED").length;
            const totalCount = projects.length;
            const completionRate = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
            const membersCount = currentWorkspace.members?.length || 1;

            setStats({
                totalProjects: totalCount,
                activeProjects: projects.filter(
                    (p: any) => p.status !== "CANCELLED" && p.status !== "COMPLETED"
                ).length,
                completedProjects: completedCount,
                myTasks: projects.reduce(
                    (acc: number, project: any) =>
                        acc +
                        (project.tasks?.filter(
                            (t: any) => t.assigneeId === currentWorkspace.ownerId || t.assignee?.email === currentWorkspace.owner?.email
                        ) || []).length,
                    0
                ),
                overdueIssues: projects.reduce(
                    (acc: number, project: any) =>
                        acc + (project.tasks?.filter((t: any) => t.due_date && new Date(t.due_date) < new Date() && t.status !== "DONE").length || 0),
                    0
                ),
                completionRate,
                activeMembers: membersCount,
            });
        }
    }, [currentWorkspace]);

    const getSparklineData = (value: number, cardIndex: number) => {
        const baseShapes = [
            [8, 14, 11, 20, 18, 26, 22],  // Card 0 (Blue): climb
            [1, 2, 4, 8, 7, 13, 15],      // Card 1 (Green): growth
            [15, 8, 22, 12, 18, 14, 25],  // Card 2 (Purple): fluctuating
            [25, 20, 14, 10, 12, 6, 4],   // Card 3 (Red): decline
            [30, 50, 40, 75, 60, 85, 70],  // Card 4 (Yellow): double hump
            [2, 2, 4, 4, 6, 8, 8],        // Card 5 (Teal): steps
        ];

        const shape = baseShapes[cardIndex] || baseShapes[0];
        const lastVal = shape[shape.length - 1];
        const scale = value === 0 ? 0.3 : value / lastVal;

        return shape.map((val, idx) => ({ id: idx, value: val * scale }));
    };

    const statCards = [
        {
            icon: FolderOpen,
            title: "Total Projects",
            value: stats.totalProjects,
            percentage: "+18.4%",
            color: "#3b82f6", // Blue
            textColor: "text-blue-500",
            bgColor: "bg-blue-500/10",
            pillBg: "bg-blue-500/10 text-blue-500 dark:bg-blue-500/20",
            sparklineData: getSparklineData(stats.totalProjects, 0),
        },
        {
            icon: CheckCircle,
            title: "Completed Projects",
            value: stats.completedProjects,
            percentage: "+22.1%",
            color: "#10b981", // Green
            textColor: "text-emerald-500",
            bgColor: "bg-emerald-500/10",
            pillBg: "bg-emerald-500/10 text-emerald-500 dark:bg-emerald-500/20",
            sparklineData: getSparklineData(stats.completedProjects, 1),
        },
        {
            icon: Activity,
            title: "My Tasks",
            value: stats.myTasks,
            percentage: "+12.7%",
            color: "#8b5cf6", // Purple
            textColor: "text-violet-500",
            bgColor: "bg-violet-500/10",
            pillBg: "bg-violet-500/10 text-violet-500 dark:bg-violet-500/20",
            sparklineData: getSparklineData(stats.myTasks, 2),
        },
        {
            icon: AlertTriangle,
            title: "Overdue Tasks",
            value: stats.overdueIssues,
            percentage: "-5.3%",
            color: "#ef4444", // Red
            textColor: "text-rose-500",
            bgColor: "bg-rose-500/10",
            pillBg: "bg-rose-500/10 text-rose-500 dark:bg-rose-500/20",
            sparklineData: getSparklineData(stats.overdueIssues, 3),
        },
        {
            icon: TrendingUp,
            title: "Completion Rate",
            value: `${stats.completionRate}%`,
            percentage: "+8.2%",
            color: "#f59e0b", // Yellow/Orange
            textColor: "text-amber-500",
            bgColor: "bg-amber-500/10",
            pillBg: "bg-amber-500/10 text-amber-500 dark:bg-amber-500/20",
            sparklineData: getSparklineData(stats.completionRate, 4),
        },
        {
            icon: Users,
            title: "Active Members",
            value: stats.activeMembers,
            percentage: "+3.2%",
            color: "#14b8a6", // Teal
            textColor: "text-teal-500",
            bgColor: "bg-teal-500/10",
            pillBg: "bg-teal-500/10 text-teal-500 dark:bg-teal-500/20",
            sparklineData: getSparklineData(stats.activeMembers, 5),
        },
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 md:gap-5 my-6">
            {statCards.map(
                ({ icon: Icon, title, value, percentage, color, textColor, bgColor, pillBg, sparklineData }, i) => (
                    <Card key={i} className="relative overflow-hidden bg-card border border-border hover:border-border/80 hover:bg-accent/40 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 flex flex-col justify-between rounded-xl">
                        <CardContent className="p-5 pb-0 flex flex-col justify-between h-full">
                            {/* Top header: Icon & Pill */}
                            <div className="flex items-center justify-between mb-4">
                                <div className={`p-2 rounded-xl ${bgColor} flex items-center justify-center`}>
                                    <Icon className={`h-4.5 w-4.5 ${textColor}`} />
                                </div>
                                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${pillBg}`}>
                                    {percentage}
                                </span>
                            </div>

                            {/* Middle body: Title & Value */}
                            <div className="mb-2">
                                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                                    {title}
                                </p>
                                <h3 className="text-xl font-bold text-foreground mt-0.5 tracking-tight">
                                    {value}
                                </h3>
                            </div>

                            {/* Sparkline chart */}
                            <div className="w-full h-8 mt-2 -mx-5 overflow-hidden rounded-b-xl opacity-75 self-end" style={{ width: 'calc(100% + 40px)' }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={sparklineData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                                        <defs>
                                            <linearGradient id={`gradient-${color}-${i}`} x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="0%" stopColor={color} stopOpacity={0.25} />
                                                <stop offset="100%" stopColor={color} stopOpacity={0.0} />
                                            </linearGradient>
                                        </defs>
                                        <Area
                                            type="monotone"
                                            dataKey="value"
                                            stroke={color}
                                            strokeWidth={1.5}
                                            fill={`url(#gradient-${color}-${i})`}
                                            dot={false}
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>
                )
            )}
        </div>
    );
}
