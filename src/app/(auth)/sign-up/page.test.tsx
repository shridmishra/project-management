import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import SignUpPage from './page'
import { authClient } from '@/lib/auth-client'

// Mock the auth client
jest.mock('@/lib/auth-client', () => ({
    authClient: {
        signUp: {
            email: jest.fn()
        },
        signIn: {
            social: jest.fn()
        }
    }
}))

// Mock next/navigation
jest.mock("next/navigation", () => ({
    useRouter() {
        return {
            push: jest.fn(),
            replace: jest.fn(),
            prefetch: jest.fn(),
        };
    },
}));

describe('SignUp Page', () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })

    it('renders sign up form', () => {
        render(<SignUpPage />)
        expect(screen.getByPlaceholderText('John Doe')).toBeInTheDocument()
        expect(screen.getByPlaceholderText('m@example.com')).toBeInTheDocument()
        expect(screen.getByText('Create your account to get started.')).toBeInTheDocument()
    })

    it('handles email sign up', async () => {
        const mockSignUpEmail = authClient.signUp.email as jest.Mock
        mockSignUpEmail.mockResolvedValue({ data: {} })

        render(<SignUpPage />)

        fireEvent.change(screen.getByPlaceholderText('John Doe'), { target: { value: 'Test User' } })
        fireEvent.change(screen.getByPlaceholderText('m@example.com'), { target: { value: 'test@example.com' } })
        fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'password123' } })

        fireEvent.click(screen.getByRole('button', { name: 'Sign Up' }))

        await waitFor(() => {
            expect(mockSignUpEmail).toHaveBeenCalledWith({
                email: 'test@example.com',
                password: 'password123',
                name: 'Test User',
                callbackURL: '/dashboard'
            }, expect.any(Object))
        })
    })

    it('handles google sign in', async () => {
        const mockSignInSocial = authClient.signIn.social as jest.Mock

        render(<SignUpPage />)

        const googleButton = screen.getByText('Sign up with Google')
        fireEvent.click(googleButton)

        await waitFor(() => {
            expect(mockSignInSocial).toHaveBeenCalledWith({
                provider: 'google',
                callbackURL: '/dashboard'
            })
        })
    })

    it('handles guest login', async () => {
        const mockSignUpEmail = authClient.signUp.email as jest.Mock
        mockSignUpEmail.mockResolvedValue({ data: {} })

        render(<SignUpPage />)

        const guestBtn = screen.getByRole('button', { name: /login as guest/i })
        expect(guestBtn).toBeInTheDocument()
        fireEvent.click(guestBtn)

        await waitFor(() => {
            expect(mockSignUpEmail).toHaveBeenCalledWith({
                email: expect.stringMatching(/^guest_\d+_\d+@example.com$/),
                password: 'GuestPassword123!',
                name: 'Guest User',
                callbackURL: '/dashboard',
            }, expect.any(Object))
        })
    })
})
