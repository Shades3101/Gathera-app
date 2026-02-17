"use client";

import { Button } from "@/components/ui/button";
import { Menu, X, PlayCircle } from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { UserAvatar } from "@/components/UserAvatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { useLogout } from "@/hooks/useLogout";

interface User {
  id: string;
  email: string;
  photo?: string;
  name?: string;
}

const Header = ({ user }: { user: User | null }) => {
  console.log(user)
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const pathname = usePathname();
  const { logout } = useLogout();

  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  // Close dropdown when resizing to mobile
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsDropdownOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const navItems = [
    { name: "Home", href: "/" },
    { name: "Explore", href: "/explore" },
    { name: "Pricing", href: "/pricing" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md">
      <div className="container mx-auto px-4 flex h-16 items-center justify-between relative">

        {/* Logo Section */}
        <Link href="/" className="flex items-center gap-2 group">
          <span className="text-xl font-bold text-foreground tracking-tight">
            Gathera
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className={cn("text-sm font-medium transition-colors hover:text-primary",
              pathname === item.href ? "text-foreground font-semibold" : "text-muted-foreground"
            )}
            >
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Desktop Auth Buttons */}

        <div className="hidden md:flex items-center gap-4 cursor-pointer">
          {user ? (
            <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
              <DropdownMenuTrigger asChild>
                <div className="flex items-center gap-3">
                  <UserAvatar photo={user.photo} name={user.name} email={user.email} />
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-72" align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuLabel>
                  <div className="flex justify-between items-center font-semibold">
                    <span>{user.email}</span>
                    <Button variant="ghost" size="sm" className="hover:bg-red-900/70 cursor-pointer" onClick={logout}>Logout</Button>
                  </div>
                </DropdownMenuLabel>
              </DropdownMenuContent>
            </DropdownMenu>

          ) : (
            <>
              <Button variant="link" >
                <Link href="/signin" className="text-sm hover:text-blue-500 font-medium text-muted-foreground transition-colors">
                  Sign In
                </Link>
              </Button>

              <Button asChild size="sm" className="font-semibold cursor-pointer">
                <Link href="/signup">Get Started</Link>
              </Button>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-foreground p-2 hover:bg-secondary rounded-md transition-colors"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation Dropdown */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-border/40 bg-background animate-in slide-in-from-top-5 fade-in duration-200">
          <div className="container mx-auto px-4 py-6 flex flex-col gap-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={
                  cn("text-base font-medium transition-colors hover:text-primary py-2 border-b border-border/50", pathname === item.href ? "text-foreground" : "text-muted-foreground")}
              >
                {item.name}
              </Link>
            ))}
            {user ? (
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3 px-2">
                  <UserAvatar photo={user.photo} name={user.name} email={user.email} />
                  <div className="flex justify-between">
                    <span className="text-sm font-medium truncate">{user.email}</span>
                  </div>
                  <Button variant="ghost" className="w-screen   cursor-pointer" onClick={logout}>
                    Logout
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-3 mt-4">
                <Link
                  href="/signin"
                  className="text-center py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  Sign In
                </Link>
                <Button asChild className="w-full cursor-pointer">
                  <Link href="/signup">Get Started</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;