"use client"
import { useState } from "react"
import { authClient } from "@/lib/auth-client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "react-hot-toast"
import Link from "next/link"
import { FcGoogle } from "react-icons/fc"
import { useRouter } from "next/navigation"

export function SignIn() {
    const router = useRouter()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)

    const handleGuestLogin = async () => {
        setLoading(true)
        const guestEmail = `guest_${Date.now()}_${Math.floor(Math.random() * 1000000)}@example.com`
        const guestPassword = "GuestPassword123!"
        const guestName = "Guest User"

        try {
            toast.loading("Setting up guest account...", { id: "guest-login" })
            await authClient.signUp.email({
                email: guestEmail,
                password: guestPassword,
                name: guestName,
                callbackURL: "/dashboard",
            }, {
                onSuccess: () => {
                    toast.success("Logged in as Guest!", { id: "guest-login" })
                    router.push("/dashboard")
                },
                onError: (ctx) => {
                    toast.error(ctx.error.message || "Failed to log in as guest", { id: "guest-login" })
                    setLoading(false)
                }
            })
        } catch (error: any) {
            toast.error(error?.message || "Failed to log in as guest", { id: "guest-login" })
            setLoading(false)
        }
    }

    const handleSignIn = async () => {
        setLoading(true)
        await authClient.signIn.email({
            email,
            password,
            callbackURL: "/dashboard",
        }, {
            onSuccess: () => {
                toast.success("Signed in!")
            },
            onError: (ctx) => {
                toast.error(ctx.error.message)
                setLoading(false)
            }
        })
        setLoading(false)
    }

    const handleGoogleSignIn = async () => {
        await authClient.signIn.social({
            provider: "google",
            callbackURL: "/dashboard",
        })
    }

    return (
        <Card className="w-full lg:min-w-sm">
            <CardHeader>
                <CardTitle>Sign In</CardTitle>
                <CardDescription>Welcome back! Please sign in to continue.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <Button variant="outline" type="button" className="w-full" onClick={handleGoogleSignIn}>
                    <FcGoogle className="mr-2 h-5 w-5" />
                    Sign in with Google
                </Button>

                <Button variant="secondary" type="button" className="w-full font-medium" onClick={handleGuestLogin} disabled={loading}>
                    Login as Guest
                </Button>

                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
                    </div>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="m@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
                <Button className="w-full" onClick={handleSignIn} disabled={loading}>
                    {loading ? "Signing in..." : "Sign In"}
                </Button>
            </CardContent>
            <CardFooter>
                <p className="text-center text-sm text-muted-foreground w-full">
                    Don't have an account?{" "}
                    <Link href="/sign-up" className="font-medium text-primary hover:underline">
                        Sign up
                    </Link>
                </p>
            </CardFooter>
        </Card>
    )
}
