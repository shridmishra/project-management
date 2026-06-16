'use client';
export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import { UsersIcon, Search, UserPlus, Shield, Activity } from "lucide-react";
import InviteMemberDialog from "@/features/workspaces/components/InviteMemberDialog";
import { useSelector } from "react-redux";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

const Team = () => {

    const [tasks, setTasks] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [users, setUsers] = useState([]);
    const currentWorkspace = useSelector((state: any) => state?.workspace?.currentWorkspace || null);
    const projects = currentWorkspace?.projects || [];

    const filteredUsers = users.filter(
        (user: any) =>
            user?.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user?.user?.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    useEffect(() => {
        setUsers(currentWorkspace?.members || []);
        setTasks(currentWorkspace?.projects?.reduce((acc: any, project: any) => [...acc, ...project.tasks], []) || []);
    }, [currentWorkspace]);

    return (
        <div className="space-y-6 max-w-6xl mx-auto py-8 px-6">
            {/* Header */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                <div>
                    <h1 className="text-xl sm:text-2xl font-semibold text-foreground mb-1">Team</h1>
                    <p className="text-muted-foreground text-sm">
                        Manage team members and their contributions
                    </p>
                </div>
                <Button onClick={() => setIsDialogOpen(true)}>
                    <UserPlus className="w-4 h-4 mr-2" /> Invite Member
                </Button>
                <InviteMemberDialog isDialogOpen={isDialogOpen} setIsDialogOpen={setIsDialogOpen} />
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Total Members */}
                <Card>
                    <CardContent className="p-6 flex items-center justify-between">
                        <div>
                            <p className="text-sm text-muted-foreground">Total Members</p>
                            <p className="text-xl font-bold text-foreground">{users.length}</p>
                        </div>
                        <div className="p-3 rounded-xl bg-info/20">
                            <UsersIcon className="h-4 w-4 text-info" />
                        </div>
                    </CardContent>
                </Card>

                {/* Active Projects */}
                <Card>
                    <CardContent className="p-6 flex items-center justify-between">
                        <div>
                            <p className="text-sm text-muted-foreground">Active Projects</p>
                            <p className="text-xl font-bold text-foreground">
                                {projects.filter((p: any) => p.status !== "CANCELLED" && p.status !== "COMPLETED").length}
                            </p>
                        </div>
                        <div className="p-3 rounded-xl bg-success/20">
                            <Activity className="h-4 w-4 text-success" />
                        </div>
                    </CardContent>
                </Card>

                {/* Total Tasks */}
                <Card>
                    <CardContent className="p-6 flex items-center justify-between">
                        <div>
                            <p className="text-sm text-muted-foreground">Total Tasks</p>
                            <p className="text-xl font-bold text-foreground">{tasks.length}</p>
                        </div>
                        <div className="p-3 rounded-xl bg-primary/20">
                            <Shield className="h-4 w-4 text-primary" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Search */}
            <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                    placeholder="Search team members..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                />
            </div>

            {/* Team Members */}
            <div className="w-full">
                {filteredUsers.length === 0 ? (
                    <div className="col-span-full text-center py-16">
                        <div className="w-24 h-24 mx-auto mb-6 bg-muted rounded-full flex items-center justify-center">
                            <UsersIcon className="w-12 h-12 text-muted-foreground" />
                        </div>
                        <h3 className="text-xl font-semibold text-foreground mb-2">
                            {users.length === 0
                                ? "No team members yet"
                                : "No members match your search"}
                        </h3>
                        <p className="text-muted-foreground mb-6">
                            {users.length === 0
                                ? "Invite team members to start collaborating"
                                : "Try adjusting your search term"}
                        </p>
                    </div>
                ) : (
                    <div className="max-w-4xl w-full">
                        {/* Desktop Table */}
                        <div className="hidden sm:block rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Email</TableHead>
                                        <TableHead>Role</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredUsers.map((user: any) => (
                                        <TableRow key={user.id}>
                                            <TableCell className="flex items-center gap-3">
                                                <Avatar className="h-8 w-8">
                                                    <AvatarImage src={user.user.image} />
                                                    <AvatarFallback>{user.user.name?.[0]}</AvatarFallback>
                                                </Avatar>
                                                <span className="text-sm font-medium text-foreground truncate">
                                                    {user.user?.name || "Unknown User"}
                                                </span>
                                            </TableCell>
                                            <TableCell className="text-muted-foreground">
                                                 <div className="truncate max-w-[160px] md:max-w-[240px]" title={user.user.email}>
                                                     {user.user.email}
                                                 </div>
                                             </TableCell>
                                            <TableCell>
                                                <Badge variant={user.role === "ADMIN" ? "default" : "secondary"}>
                                                    {user.role || "User"}
                                                </Badge>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>

                        {/* Mobile Cards */}
                        <div className="sm:hidden space-y-3">
                            {filteredUsers.map((user: any) => (
                                <Card key={user.id}>
                                    <CardContent className="p-4 flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-9 w-9">
                                                <AvatarImage src={user.user.image} />
                                                <AvatarFallback>{user.user.name?.[0]}</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <p className="font-medium text-foreground">
                                                    {user.user?.name || "Unknown User"}
                                                </p>
                                                 <p className="text-sm text-muted-foreground truncate max-w-[200px]" title={user.user.email}>
                                                     {user.user.email}
                                                 </p>
                                            </div>
                                        </div>
                                        <Badge variant={user.role === "ADMIN" ? "default" : "secondary"}>
                                            {user.role || "User"}
                                        </Badge>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Team;
