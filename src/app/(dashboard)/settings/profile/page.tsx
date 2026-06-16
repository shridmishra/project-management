"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CameraIcon, SaveIcon, UserIcon } from "lucide-react";
import toast from "react-hot-toast";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProfileSettingsPage() {
    const { data: session, isPending } = useSession();
    const [name, setName] = useState("");
    const [image, setImage] = useState("");
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (session?.user) {
            setName(session.user.name || "");
            setImage(session.user.image || "");
        }
    }, [session]);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            const response = await fetch('/api/users/profile', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, image }),
            });

            if (response.ok) {
                toast.success("Profile updated successfully");
                // Refresh session or state if needed
                window.location.reload(); // Simple way to refresh all UI
            } else {
                throw new Error("Failed to update profile");
            }
        } catch (error) {
            toast.error("Failed to update profile");
        } finally {
            setSaving(false);
        }
    };

    if (isPending) {
        return (
            <div className="max-w-2xl mx-auto py-10 px-6 space-y-6">
                <div className="space-y-2">
                    <Skeleton className="h-8 w-48" />
                    <Skeleton className="h-4 w-72" />
                </div>
                <Card>
                    <CardHeader className="space-y-2">
                        <Skeleton className="h-6 w-32" />
                        <Skeleton className="h-4 w-64" />
                    </CardHeader>
                    <CardContent className="space-y-8">
                        <div className="flex flex-col items-center sm:flex-row gap-6 pb-2">
                            <Skeleton className="h-24 w-24 rounded-full" />
                            <div className="space-y-2 text-center sm:text-left">
                                <Skeleton className="h-5 w-32" />
                                <Skeleton className="h-3 w-48" />
                                <Skeleton className="h-8 w-28 mt-2" />
                            </div>
                        </div>
                        <div className="grid gap-6">
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-24" />
                                <Skeleton className="h-10 w-full" />
                            </div>
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-24" />
                                <Skeleton className="h-10 w-full" />
                            </div>
                        </div>
                        <div className="flex justify-end pt-4">
                            <Skeleton className="h-10 w-32" />
                        </div>
                    </CardContent>
                </Card>
            </div>
        )
    }

    const initials = name
        ? name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2)
        : session?.user?.email?.[0].toUpperCase() || 'U';

    return (
        <div className="max-w-2xl mx-auto py-10 px-6 space-y-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Account Settings</h1>
                <p className="text-muted-foreground">Manage your profile and personal information.</p>
            </div>

            <Card className="border-border/50 shadow-sm">
                <CardHeader>
                    <CardTitle>Profile Details</CardTitle>
                    <CardDescription>Update your name and profile picture.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSave} className="space-y-8">
                        {/* Avatar Upload Simulation */}
                        <div className="flex flex-col items-center sm:flex-row gap-6 pb-2">
                            <div className="relative group">
                                <Avatar className="h-24 w-24 border-4 border-background shadow-xl">
                                    <AvatarImage src={image} />
                                    <AvatarFallback className="text-2xl font-bold bg-primary/10 text-primary">
                                        {initials}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer" onClick={() => {
                                    const url = window.prompt("Enter new image URL:");
                                    if (url) setImage(url);
                                }}>
                                    <CameraIcon className="h-6 w-6 text-white" />
                                </div>
                            </div>
                            <div className="space-y-1 text-center sm:text-left">
                                <h3 className="font-semibold">{name || "User"}</h3>
                                <p className="text-xs text-muted-foreground truncate max-w-[200px] sm:max-w-[300px]">{session?.user?.email}</p>
                                <Button type="button" variant="outline" size="sm" className="mt-2 h-8" onClick={() => {
                                    const url = window.prompt("Enter new image URL:");
                                    if (url) setImage(url);
                                }}>
                                    Change Photo
                                </Button>
                            </div>
                        </div>

                        <div className="grid gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Display Name</Label>
                                <div className="relative">
                                    <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="Enter your name"
                                        className="pl-10"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2 pt-2">
                                <Label htmlFor="email">Email Address</Label>
                                <Input id="email" value={session?.user?.email || ""} disabled className="bg-muted/50" />
                                <p className="text-[10px] text-muted-foreground">Email cannot be changed.</p>
                            </div>
                        </div>

                        <div className="flex justify-end pt-4">
                            <Button type="submit" disabled={saving}>
                                {saving ? "Saving..." : <><SaveIcon className="mr-2 h-4 w-4" /> Save Changes</>}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>

            <Card className="border-destructive/20 bg-destructive/5">
                <CardHeader>
                    <CardTitle className="text-destructive font-semibold">Danger Zone</CardTitle>
                    <CardDescription>Actions that cannot be undone.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Button variant="destructive" className="w-full sm:w-auto">
                        Delete Account
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
