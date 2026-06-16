import { useState } from "react";
import { XIcon } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { createProjectAsync } from "@/features/workspaces/store/workspaceSlice";
import type { AppDispatch } from "@/lib/store";
import { DatePicker } from "@/components/ui/date-picker";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"

const CreateProjectDialog = ({ isDialogOpen, setIsDialogOpen }) => {

    const dispatch = useDispatch<AppDispatch>();
    const { currentWorkspace } = useSelector((state: any) => state.workspace);

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        status: "PLANNING",
        priority: "MEDIUM",
        start_date: "",
        end_date: "",
        team_members: [],
        team_lead: "",
        progress: 0,
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!currentWorkspace) return;

        setIsSubmitting(true);
        try {
            // Find the team lead user id from email
            const teamLeadMember = currentWorkspace.members?.find(
                (m: any) => m.user.email === formData.team_lead
            );
            const teamLeadId = teamLeadMember?.user?.id || currentWorkspace.ownerId;

            // Find member user ids from emails
            const memberIds = formData.team_members.map((email: string) => {
                const member = currentWorkspace.members?.find((m: any) => m.user.email === email);
                return member?.user?.id;
            }).filter(Boolean);

            await dispatch(createProjectAsync({
                name: formData.name,
                description: formData.description,
                status: formData.status,
                priority: formData.priority,
                startDate: formData.start_date || null,
                endDate: formData.end_date || null,
                teamLead: teamLeadId,
                workspaceId: currentWorkspace.id,
                memberIds: memberIds.length > 0 ? memberIds : [teamLeadId],
            })).unwrap();

            toast.success("Project created successfully!");
            setFormData({
                name: "",
                description: "",
                status: "PLANNING",
                priority: "MEDIUM",
                start_date: "",
                end_date: "",
                team_members: [],
                team_lead: "",
                progress: 0,
            });
            setIsDialogOpen(false);
        } catch (error: any) {
            toast.error(error.message || "Failed to create project");
        } finally {
            setIsSubmitting(false);
        }
    };

    const removeTeamMember = (email) => {
        setFormData((prev) => ({ ...prev, team_members: prev.team_members.filter(m => m !== email) }));
    };

    return (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Create New Project</DialogTitle>
                    <DialogDescription>
                        {currentWorkspace && (
                            <span>In workspace: <span className="text-primary font-medium">{currentWorkspace.name}</span></span>
                        )}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 py-4">
                    {/* Project Name */}
                    <div className="space-y-2">
                        <Label htmlFor="name">Project Name</Label>
                        <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="Enter project name"
                            required
                        />
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="Describe your project"
                            className="h-20"
                        />
                    </div>

                    {/* Status & Priority */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="status">Status</Label>
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
                                    <SelectItem value="COMPLETED">Completed</SelectItem>
                                    <SelectItem value="ON_HOLD">On Hold</SelectItem>
                                    <SelectItem value="CANCELLED">Cancelled</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="priority">Priority</Label>
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

                    {/* Dates */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2 flex flex-col">
                            <Label htmlFor="start_date" className="mb-2">Start Date</Label>
                            <DatePicker
                                id="start_date"
                                value={formData.start_date}
                                onChange={(value) => setFormData({ ...formData, start_date: value })}
                            />
                        </div>
                        <div className="space-y-2 flex flex-col">
                            <Label htmlFor="end_date" className="mb-2">End Date</Label>
                            <DatePicker
                                id="end_date"
                                value={formData.end_date}
                                onChange={(value) => setFormData({ ...formData, end_date: value })}
                                min={formData.start_date}
                            />
                        </div>
                    </div>

                    {/* Lead */}
                    <div className="space-y-2">
                        <Label htmlFor="team_lead">Project Lead</Label>
                        <Select
                            value={formData.team_lead}
                            onValueChange={(value) => {
                                const lead = value === "no-lead" ? "" : value;
                                setFormData({
                                    ...formData,
                                    team_lead: lead,
                                    team_members: lead ? [...new Set([...formData.team_members, lead])] : formData.team_members
                                });
                            }}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select lead" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="no-lead">No lead</SelectItem>
                                {currentWorkspace?.members?.map((member) => (
                                    <SelectItem key={member.user.email} value={member.user.email}>
                                        {member.user.email}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Team Members */}
                    <div className="space-y-2">
                        <Label htmlFor="team_members">Team Members</Label>
                        <Select
                            onValueChange={(value) => {
                                if (value && !formData.team_members.includes(value)) {
                                    setFormData((prev) => ({ ...prev, team_members: [...prev.team_members, value] }));
                                }
                            }}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Add team members" />
                            </SelectTrigger>
                            <SelectContent>
                                {currentWorkspace?.members
                                    ?.filter((member) => !formData.team_members.includes(member.user.email))
                                    .map((member) => (
                                        <SelectItem key={member.user.email} value={member.user.email}>
                                            {member.user.email}
                                        </SelectItem>
                                    ))}
                            </SelectContent>
                        </Select>

                        {formData.team_members.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-2">
                                {formData.team_members.map((email) => (
                                    <Badge key={email} variant="secondary" className="gap-1 max-w-[200px] flex items-center" title={email}>
                                        <span className="truncate">{email}</span>
                                        <button type="button" onClick={() => removeTeamMember(email)} className="ml-1 hover:text-destructive shrink-0">
                                            <XIcon className="w-3 h-3" />
                                        </button>
                                    </Badge>
                                ))}
                            </div>
                        )}
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isSubmitting || !currentWorkspace}>
                            {isSubmitting ? "Creating..." : "Create Project"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default CreateProjectDialog;