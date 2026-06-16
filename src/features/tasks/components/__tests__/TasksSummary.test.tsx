import { render, screen } from '@testing-library/react'
import { renderWithProviders } from '@/test-utils'
import TasksSummary from '../TasksSummary'
import { authClient } from '@/lib/auth-client'

jest.mock('@/lib/auth-client')

describe('TasksSummary', () => {
    const mockUser = { id: 'user-1' }
    
    beforeEach(() => {
        (authClient.useSession as jest.Mock).mockReturnValue({
            data: { user: mockUser }
        })
    })

    it('displays overdue tasks and badge count', () => {
        const overdueDate = new Date();
        overdueDate.setDate(overdueDate.getDate() - 2); // 2 days ago

        const mockTasks = [
            { id: '1', title: 'Task 1', assigneeId: 'user-1', status: 'TODO', type: 'bug', priority: 'HIGH' },
            { id: '2', title: 'Task 2', assigneeId: 'other', status: 'IN_PROGRESS', type: 'feature', priority: 'MEDIUM' },
            { id: '3', title: 'Overdue Task 3', assigneeId: 'user-1', status: 'TODO', type: 'task', priority: 'LOW', due_date: overdueDate.toISOString() }
        ]

        const mockWorkspace = {
            id: 'ws-1',
            projects: [{
                id: 'p1',
                tasks: mockTasks
            }]
        }

        renderWithProviders(<TasksSummary />, {
            preloadedState: {
                workspace: {
                    currentWorkspace: mockWorkspace,
                    workspaces: [],
                    loading: false,
                    error: null
                }
            }
        })

        expect(screen.getByText(/Overdue Tasks/i)).toBeInTheDocument()
        expect(screen.getByText('Overdue Task 3')).toBeInTheDocument()
        
        // Badge count of overdue tasks should be 1
        expect(screen.getByText('1')).toBeInTheDocument()
    })
})
