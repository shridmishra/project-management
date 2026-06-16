"use client";

import { format } from "date-fns";
import { Plus, Save } from "lucide-react";
import { useEffect, useState } from "react";
import AddProjectMember from "./AddProjectMember";
import { DatePicker } from "@/components/ui/date-picker";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"

export default function ProjectSettings({ project }) {

    const [formData, setFormData] = useState({
        name: "New Website Launch",
        description: "Initial launch for new web platform.",
        status: "PLANNING",
        priority: "MEDIUM",
        start_date: "2025-09-10",
        end_date: "2025-10-15",
        progress: 30,
    });

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

    };

    useEffect(() => {
        if (project) setFormData(project);
    }, [project]);

    return (
        <div className="grid lg:grid-cols-2 gap-8">
            {/* Project Details */}
            <Card>
                <CardHeader>
                    <CardTitle>Project Details</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Name */}
                        <div className="space-y-2">
                            <Label>Project Name</Label>
                            <Input
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                            />
                        </div>

                        {/* Description */}
                        <div className="space-y-2">
                            <Label>Description</Label>
                            <Textarea
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                className="h-24"
                            />
                        </div>

                        {/* Status & Priority */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Status</Label>
                                <Select
                                    value={formData.status}
                                    onValueChange={(value) => setFormData({ ...formData, status: value })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="PLANNING">Planning</SelectItem>
                                        <SelectItem value="ACTIVE">Active</SelectItem>
                                        <SelectItem value="ON_HOLD">On Hold</SelectItem>
                                        <SelectItem value="COMPLETED">Completed</SelectItem>
                                        <SelectItem value="CANCELLED">Cancelled</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label>Priority</Label>
                                <Select
                                    value={formData.priority}
                                    onValueChange={(value) => setFormData({ ...formData, priority: value })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select priority" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="LOW">Low</SelectItem>
                                        <SelectItem value="MEDIUM">Medium</SelectItem>
                                        <SelectItem value="HIGH">High</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {/* Timeline */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Start Date</Label>
                                <DatePicker
                                    value={formData.start_date ? (typeof formData.start_date === 'string' ? formData.start_date.split('T')[0] : format(formData.start_date, "yyyy-MM-dd")) : ""}
                                    onChange={(value) => setFormData({ ...formData, start_date: value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>End Date</Label>
                                <DatePicker
                                    value={formData.end_date ? (typeof formData.end_date === 'string' ? formData.end_date.split('T')[0] : format(formData.end_date, "yyyy-MM-dd")) : ""}
                                    onChange={(value) => setFormData({ ...formData, end_date: value })}
                                    min={formData.start_date ? (typeof formData.start_date === 'string' ? formData.start_date.split('T')[0] : format(formData.start_date, "yyyy-MM-dd")) : undefined}
                                />
                            </div>
                        </div>

                        {/* Progress */}
                        <div className="space-y-2">
                            <Label>Progress: {formData.progress}%</Label>
                            <Input
                                type="range"
                                min="0"
                                max="100"
                                step="5"
                                value={formData.progress}
                                onChange={(e) => setFormData({ ...formData, progress: Number(e.target.value) })}
                                className="w-full accent-primary"
                            />
                        </div>

                        {/* Save Button */}
                        <div className="flex justify-end">
                            <Button type="submit" disabled={isSubmitting}>
                                <Save className="mr-2 h-4 w-4" />
                                {isSubmitting ? "Saving..." : "Save Changes"}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>

            {/* Team Members */}
            <div className="space-y-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-lg font-medium">
                            Team Members <span className="text-sm text-muted-foreground">({project.members.length})</span>
                        </CardTitle>
                        <Button variant="outline" size="icon" onClick={() => setIsDialogOpen(true)}>
                            <Plus className="h-4 w-4" />
                        </Button>
                        <AddProjectMember isDialogOpen={isDialogOpen} setIsDialogOpen={setIsDialogOpen} />
                    </CardHeader>
                    <CardContent>
                        {/* Member List */}
                        {project.members.length > 0 && (
                            <div className="space-y-2 mt-2 max-h-32 overflow-y-auto">
                                {project.members.map((member, index) => (
                                    <div key={index} className="flex items-center justify-between px-3 py-2 rounded-md bg-muted/50 text-sm" >
                                        <span className="truncate inline-block max-w-[150px] sm:max-w-[220px]" title={member?.user?.email || "Unknown"}> {member?.user?.email || "Unknown"} </span>
                                        {project.team_lead === member.user.id && (
                                            <Badge variant="secondary">Team Lead</Badge>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
