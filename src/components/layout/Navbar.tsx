import { SearchIcon, MoonIcon, SunIcon, LogOut, User } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { toggleTheme } from '@/features/theme/store/themeSlice'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar"
import { useSession, signOut } from '@/lib/auth-client'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useRouter } from 'next/navigation'
import NotificationDropdown from './NotificationDropdown'

const Navbar = () => {
    const dispatch = useDispatch();
    const router = useRouter();
    const { theme } = useSelector((state: any) => state.theme);
    const { data: session } = useSession();
    const { open, isMobile } = useSidebar();

    const handleSignOut = async () => {
        await signOut({
            fetchOptions: {
                onSuccess: () => {
                    router.push("/");
                },
            },
        });
    };

    const userInitials = session?.user?.name
        ? session.user.name.split(' ').map((n: string) => n[0]).join('').toUpperCase().substring(0, 2)
        : 'U';

    return (
        <div className="w-full bg-background border-b border-border px-6 xl:px-16 py-3 flex-shrink-0">
            <div className="flex items-center justify-between max-w-6xl mx-auto">
                {/* Left section */}
                <div className="flex items-center gap-4 min-w-0 flex-1">
                    {/* Sidebar Trigger */}
                    <SidebarTrigger className={open && !isMobile ? "hidden" : ""} />

                    {/* Search Input */}
                    <div className="relative flex-1 max-w-sm hidden md:flex">
                        <SearchIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                        <Input
                            type="text"
                            placeholder="Search projects, tasks..."
                            className="pl-9 bg-background"
                        />
                    </div>
                </div>

                {/* Right section */}
                <div className="flex items-center gap-3">

                    {/* Notifications */}
                    <NotificationDropdown />

                    {/* Theme Toggle */}
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => dispatch(toggleTheme())}
                        className="h-8 w-8 rounded-lg"
                    >
                        {
                            theme === "light"
                                ? (<MoonIcon className="h-4 w-4" />)
                                : (<SunIcon className="h-4 w-4" />)
                        }
                    </Button>

                    {/* User Avatar Dropdown */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Avatar className="cursor-pointer h-9 w-9 border border-border transition-opacity hover:opacity-80">
                                <AvatarImage src={session?.user?.image || ""} alt={session?.user?.name || "User"} />
                                <AvatarFallback className="bg-primary/10 text-primary font-medium">
                                    {userInitials}
                                </AvatarFallback>
                            </Avatar>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56">
                            <DropdownMenuLabel>
                                <div className="flex flex-col space-y-1">
                                    <p className="text-sm font-medium leading-none">{session?.user?.name || "Guest"}</p>
                                    <p className="text-xs leading-none text-muted-foreground truncate max-w-[170px]" title={session?.user?.email || "guest@example.com"}>
                                        {session?.user?.email || "guest@example.com"}
                                    </p>
                                </div>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="cursor-pointer" onClick={() => router.push('/settings/profile')}>
                                <User className="mr-2 h-4 w-4" />
                                <span>Profile</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer text-destructive focus:text-destructive" onClick={handleSignOut}>
                                <LogOut className="mr-2 h-4 w-4" />
                                <span>Sign out</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </div>
    )
}

export default Navbar
