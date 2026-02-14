"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Navbar() {
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <h1 className="text-2xl font-bold text-blue-600 font-orenza tracking-wide flex items-center">
            Taakra
            <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-1.5 ml-0.5" />
          </h1>
          <div className="hidden md:flex gap-6">
            <a
              href="/dashboard"
              className="text-slate-600 hover:text-slate-900 font-medium transition"
            >
              Dashboard
            </a>
            <a
              href="/competitions"
              className="text-slate-600 hover:text-slate-900 font-medium transition"
            >
              Browse
            </a>
            <a
              href="/discover"
              className="text-slate-600 hover:text-slate-900 font-medium transition"
            >
              Discover
            </a>
            {user && (user.role === "organizer" || user.role === "admin") && (
              <>
                <a
                  href="/admin"
                  className="text-slate-600 hover:text-slate-900 font-medium transition"
                >
                  Admin
                </a>
                <a
                  href="/admin/competitions"
                  className="text-slate-600 hover:text-slate-900 font-medium transition"
                >
                  Manage
                </a>
                <a
                  href="/admin/registrations"
                  className="text-slate-600 hover:text-slate-900 font-medium transition"
                >
                  Registrations
                </a>
                <a
                  href="/admin/analytics"
                  className="text-slate-600 hover:text-slate-900 font-medium transition"
                >
                  Analytics
                </a>
                <a
                  href="/admin/support"
                  className="text-slate-600 hover:text-slate-900 font-medium transition"
                >
                  Support
                </a>
              </>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="gap-2">
                <div className="text-right">
                  <p className="text-sm font-medium text-slate-900">
                    {user?.displayName || user?.email?.split("@")[0] || "User"}
                  </p>
                  <p className="text-xs text-slate-500">{user?.email}</p>
                </div>
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium">
                  {(user?.email?.[0] || "U").toUpperCase()}
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => router.push("/dashboard")}>
                Dashboard
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push("/dashboard")}>
                Profile Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
}
