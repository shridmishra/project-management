"use client";

import React from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { SiZapier, SiWebflow, SiSlack, SiHubspot, SiFiverr } from "react-icons/si";
import { ArrowRight, Sun, Moon } from "lucide-react";
import Link from 'next/link';
import { useSession, authClient } from "@/lib/auth-client";
import { useDispatch, useSelector } from "react-redux";
import { toggleTheme } from "@/features/theme/store/themeSlice";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

interface HeroProps {
    className?: string;
}

export const Hero = ({ className }: HeroProps) => {
    const dispatch = useDispatch();
    const { theme } = useSelector((state: any) => state.theme);
    const { data: session } = useSession();
    const [mounted, setMounted] = React.useState(false);
    const router = useRouter();
    const [loadingGuest, setLoadingGuest] = React.useState(false);

    const handleGuestLogin = async () => {
        setLoadingGuest(true);
        const guestEmail = `guest_${Date.now()}_${Math.floor(Math.random() * 1000000)}@example.com`;
        const guestPassword = "GuestPassword123!";
        const guestName = "Guest User";

        try {
            toast.loading("Setting up guest account...", { id: "guest-login" });
            await authClient.signUp.email({
                email: guestEmail,
                password: guestPassword,
                name: guestName,
                callbackURL: "/dashboard",
            }, {
                onSuccess: () => {
                    toast.success("Logged in as Guest!", { id: "guest-login" });
                    router.push("/dashboard");
                },
                onError: (ctx) => {
                    toast.error(ctx.error.message || "Failed to log in as guest", { id: "guest-login" });
                    setLoadingGuest(false);
                }
            });
        } catch (error: any) {
            toast.error(error?.message || "Failed to log in as guest", { id: "guest-login" });
            setLoadingGuest(false);
        }
    };

    React.useEffect(() => {
        setMounted(true);
    }, []);

    const isDark = theme === "dark";

    // Heights relative to the container, creating a V-shape
    const bars = [
        { height: "65%", opacity: 0.3 },
        { height: "50%", opacity: 0.4 },
        { height: "40%", opacity: 0.5 },
        { height: "30%", opacity: 0.6 },
        { height: "25%", opacity: 0.7 },
        { height: "20%", opacity: 0.8 },
        { height: "15%", opacity: 0.9 }, // Center
        { height: "20%", opacity: 0.8 },
        { height: "25%", opacity: 0.7 },
        { height: "30%", opacity: 0.6 },
        { height: "40%", opacity: 0.5 },
        { height: "50%", opacity: 0.4 },
        { height: "65%", opacity: 0.3 },
    ];

    return (
        <div className={isDark ? "dark" : ""}>
            <div
                className={cn(
                    "relative w-full min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white overflow-hidden font-sans selection:bg-emerald-500/30",
                    className
                )}
            >
                {/* Navbar */}
                <nav className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-4 md:px-6 md:py-6 max-w-7xl mx-auto w-full">
                    {/* Logo */}
                    <div className="flex items-center gap-2 font-bold text-lg md:text-xl tracking-tight">
                        <div className="w-6 h-6 bg-black dark:bg-white rounded-full flex items-center justify-center">
                            <div className="w-2 h-2 bg-white dark:bg-black rounded-full" />
                        </div>
                        Topflow
                    </div>

                    {/* Auth */}
                    <div className="flex items-center gap-4 md:gap-6 text-sm font-medium">
                        {!session ? (
                            <>
                                <Link
                                    href="/sign-up"
                                    className="hidden md:block hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
                                >
                                    Sign up
                                </Link>
                                <button
                                    onClick={handleGuestLogin}
                                    disabled={loadingGuest}
                                    className="bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-white px-4 py-2 text-xs md:text-sm md:px-5 md:py-2 rounded-full transition-colors disabled:opacity-50"
                                >
                                    {loadingGuest ? "Logging in..." : "Login as guest"}
                                </button>
                            </>
                        ) : (
                            <Link href="/dashboard">
                                <button className="bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-white px-4 py-2 text-xs md:text-sm md:px-5 md:py-2 rounded-full transition-colors">
                                    Dashboard
                                </button>
                            </Link>
                        )}
                        <button
                            onClick={() => dispatch(toggleTheme())}
                            className="p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-900 dark:text-white transition-colors"
                        >
                            {isDark ? <Sun className="w-4 h-4 md:w-5 md:h-5" /> : <Moon className="w-4 h-4 md:w-5 md:h-5" />}
                        </button>
                    </div>
                </nav>

                {/* Bars Background */}
                <div className="absolute inset-0 flex items-end w-full h-full gap-0 justify-between pb-0 pointer-events-none">
                    {bars.map((bar, index) => (
                        <motion.div
                            key={index}
                            className="w-full rounded-t-sm bg-gradient-to-t from-pink-400 via-pink-400/60 dark:from-pink-600 dark:via-pink-600/60 to-transparent"
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: bar.height, opacity: 1 }}
                            transition={{
                                duration: 0.8,
                                delay: Math.abs(index - Math.floor(bars.length / 2)) * 0.1,
                                ease: "easeOut",
                            }}
                        />
                    ))}
                </div>

                {/* Gradient Overlay to fade top and bottom */}
                <div className="absolute inset-0 bg-gradient-to-b from-white via-transparent to-white/60 dark:from-zinc-950 dark:via-transparent dark:to-zinc-950/30 pointer-events-none" />

                {/* Hero Content */}
                <div className="relative z-10 flex flex-col items-center justify-center min-h-screen text-center px-4 pt-24 md:pt-20">
                    <h1 className="text-4xl sm:text-5xl md:text-7xl font-semibold tracking-tight mb-6 md:mb-8 max-w-5xl leading-tight">
                        Manage projects with <br className="hidden md:block" /> top
                        <span className="bg-gradient-to-b from-pink-600 to-rose-400 bg-clip-text text-transparent">
                            <span className="italic px-2 md:px-4" style={{ fontFamily: "'Instrument Serif', serif" }}>efficiency</span>
                        </span>
                    </h1>
                    <p className="text-zinc-500 dark:text-zinc-400 text-base sm:text-lg md:text-xl max-w-2xl mb-8 md:mb-12 leading-relaxed">
                        Stop juggling multiple tools. Centralize your tasks, collaborate with your team in real-time, and hit your deadlines every time with our intuitive project management.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center gap-4 md:gap-6 mb-16 md:mb-24 w-full sm:w-auto px-4 sm:px-0">
                        {!session ? (
                            <button
                                onClick={handleGuestLogin}
                                disabled={loadingGuest}
                                className="w-full sm:w-auto flex items-center justify-center gap-3 bg-zinc-900 dark:bg-white text-white dark:text-black py-3 px-6 md:py-2 md:px-6 rounded-full font-medium hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
                            >
                                {loadingGuest ? "Logging in..." : "Login as guest"}
                            </button>
                        ) : (
                            <Link href="/dashboard" className="w-full sm:w-auto">
                                <button
                                    className="w-full sm:w-auto flex items-center justify-center gap-3 bg-zinc-900 dark:bg-white text-white dark:text-black py-3 px-6 md:py-2 md:px-6 rounded-full font-medium hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-all hover:scale-105 active:scale-95"
                                >
                                    Dashboard
                                </button>
                            </Link>
                        )}
                        <button className="flex items-center gap-2 text-zinc-900 dark:text-white font-medium hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors group">
                            Learn more{" "}
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>

                    {/* Trusted By */}
                    <div className="flex flex-col items-center gap-6 md:gap-8 w-full max-w-4xl mx-auto px-4">
                        <p className="text-zinc-500 dark:text-zinc-500 text-xs md:text-sm font-medium tracking-wide uppercase">
                            Trusted by <span className="text-zinc-900 dark:text-white/80">400+</span> companies
                        </p>
                        <div className="flex flex-wrap justify-center items-center gap-6 md:gap-16 text-zinc-900 dark:text-white w-full">
                            <div className="flex items-center gap-2 text-lg md:text-xl font-bold">
                                <SiZapier className="w-5 h-5 md:w-6 md:h-6" /> _zapier
                            </div>
                            <div className="flex items-center gap-2 text-lg md:text-xl font-bold">
                                <SiWebflow className="w-5 h-5 md:w-6 md:h-6" /> Webflow
                            </div>
                            <div className="flex items-center gap-2 text-lg md:text-xl font-bold">
                                <SiSlack className="w-5 h-5 md:w-6 md:h-6" /> slack
                            </div>
                            <div className="flex items-center gap-2 text-lg md:text-xl font-bold">
                                <SiHubspot className="w-5 h-5 md:w-6 md:h-6" /> HubSpot
                            </div>
                            <div className="flex items-center gap-2 text-lg md:text-xl font-bold">
                                <SiFiverr className="w-10 h-10 md:w-14 md:h-14" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
