import { db } from "@/db";
import { workspaces, workspaceMembers, projects, projectMembers, tasks, comments, notifications } from "@/db/schema";
import { v4 as uuidv4 } from 'uuid';

export async function createTemplateWorkspace(userId: string) {
    const workspaceId = `org_${Date.now()}`;
    const projectId = uuidv4();
    const projectId2 = uuidv4();
    const projectId3 = uuidv4();

    // 1. Create Workspace
    const [newWorkspace] = await db.insert(workspaces).values({
        id: workspaceId,
        name: "Example Template Workspace",
        slug: `example-template-${Date.now()}`,
        description: "This is a template workspace for you to explore features.",
        ownerId: userId,
        imageUrl: "/workspace_img_default.png",
    }).returning();

    // 2. Add Member (Owner)
    await db.insert(workspaceMembers).values({
        userId: userId,
        workspaceId: workspaceId,
        role: "ADMIN",
    });

    // 3. Create Projects
    // Project 1: Active Project (60% Progress)
    await db.insert(projects).values({
        id: projectId,
        name: "Example Project",
        description: "This is an example project to get you started.",
        priority: "MEDIUM",
        status: "ACTIVE",
        startDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week later
        teamLead: userId,
        workspaceId: workspaceId,
        progress: 60,
    });

    await db.insert(projectMembers).values({
        userId: userId,
        projectId: projectId,
    });

    // Project 2: Planning Project (0% Progress)
    await db.insert(projects).values({
        id: projectId2,
        name: "Future Roadmap",
        description: "Ideas and features for next quarter.",
        priority: "LOW",
        status: "PLANNING",
        startDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        endDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
        teamLead: userId,
        workspaceId: workspaceId,
        progress: 0,
    });

    await db.insert(projectMembers).values({
        userId: userId,
        projectId: projectId2,
    });

    // Project 3: Completed Project (100% Progress)
    await db.insert(projects).values({
        id: projectId3,
        name: "Acme Web Redesign",
        description: "Initial redesign of the Acme marketing page.",
        priority: "HIGH",
        status: "COMPLETED",
        startDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
        endDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        teamLead: userId,
        workspaceId: workspaceId,
        progress: 100,
    });

    await db.insert(projectMembers).values({
        userId: userId,
        projectId: projectId3,
    });

    // Task IDs
    const taskId1 = uuidv4();
    const taskId2 = uuidv4();
    const taskId3 = uuidv4();
    const taskId4 = uuidv4();
    const taskId5 = uuidv4();
    const taskId6 = uuidv4();
    const taskId7 = uuidv4();
    const taskId8 = uuidv4();

    // 4. Create Example Tasks
    const tasksData = [
        // Project 1: Active
        {
            id: taskId1,
            projectId: projectId,
            title: "Explore the Dashboard",
            description: "Check out the stats and overview of your new workspace.",
            status: "DONE",
            type: "TASK",
            priority: "HIGH",
            assigneeId: userId,
            dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // Yesterday
        },
        {
            id: taskId2,
            projectId: projectId,
            title: "Create your first real project",
            description: "Click the 'New Project' button to start your own journey.",
            status: "IN_PROGRESS",
            type: "FEATURE",
            priority: "MEDIUM",
            assigneeId: userId,
            dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        },
        {
            id: taskId3,
            projectId: projectId,
            title: "Invite team members",
            description: "Go to workspace settings and invite your colleagues.",
            status: "TODO",
            type: "TASK",
            priority: "LOW",
            assigneeId: userId,
            dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        },
        {
            id: taskId4,
            projectId: projectId,
            title: "Report a bug example (Overdue)",
            description: "This is what an overdue bug report looks like.",
            status: "TODO", // Not done, so it triggers overdue!
            type: "BUG",
            priority: "HIGH",
            assigneeId: userId,
            dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // Overdue by 2 days
        },
        {
            id: taskId5,
            projectId: projectId,
            title: "Improve documentation",
            description: "An example of an improvement task.",
            status: "TODO",
            type: "IMPROVEMENT",
            priority: "MEDIUM",
            assigneeId: userId,
            dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
        },
        // Project 3: Completed (All Done)
        {
            id: taskId6,
            projectId: projectId3,
            title: "Brand Guideline brainstorm",
            description: "Initial brainstorm session for colors and fonts.",
            status: "DONE",
            type: "TASK",
            priority: "MEDIUM",
            assigneeId: userId,
            dueDate: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000),
        },
        {
            id: taskId7,
            projectId: projectId3,
            title: "Figma mockup designs",
            description: "Design mockups for Desktop and Mobile viewports.",
            status: "DONE",
            type: "FEATURE",
            priority: "HIGH",
            assigneeId: userId,
            dueDate: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
        },
        {
            id: taskId8,
            projectId: projectId3,
            title: "Next.js page deployment",
            description: "Deploy the final landing page code to Vercel.",
            status: "DONE",
            type: "FEATURE",
            priority: "HIGH",
            assigneeId: userId,
            dueDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        }
    ];

    await db.insert(tasks).values(tasksData as any); 

    // 5. Create Example Comments
    await db.insert(comments).values([
        {
            id: uuidv4(),
            content: "Welcome to your new workspace! Let's get started by exploring the dashboard features.",
            userId: userId,
            taskId: taskId1,
            createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
        },
        {
            id: uuidv4(),
            content: "We've created a few sample tasks to show you around. Feel free to mark this one as complete!",
            userId: userId,
            taskId: taskId1,
            createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
        },
        {
            id: uuidv4(),
            content: "This is a task discussion thread. You can post updates, questions, or notes here.",
            userId: userId,
            taskId: taskId2,
            createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
        }
    ]);

    // 6. Create Example Notifications
    await db.insert(notifications).values([
        {
            id: uuidv4(),
            userId: userId,
            type: "TASK_ASSIGNED",
            message: "You have been assigned to 'Explore the Dashboard'",
            data: { taskId: taskId1 },
            read: false,
            createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
        },
        {
            id: uuidv4(),
            userId: userId,
            type: "COMMENT_ADDED",
            message: "New comment on 'Explore the Dashboard'",
            data: { taskId: taskId1 },
            read: false,
            createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
        },
        {
            id: uuidv4(),
            userId: userId,
            type: "PROJECT_INVITE",
            message: "You have been added to the project 'Example Project'",
            data: { projectId: projectId },
            read: true,
            createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
        }
    ]);

    return newWorkspace;
}
