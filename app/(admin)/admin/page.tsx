"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";
import { getAnalyticsOverview } from "@/lib/analytics-api";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Trophy,
  Users,
  ClipboardList,
  MessageCircle,
  BarChart3,
  Loader2,
  ArrowRight,
  AlertCircle,
} from "lucide-react";

export default function AdminDashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState<{
    totalCompetitions: number;
    pendingRegistrations: number;
    totalRegistrations: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getAnalyticsOverview()
      .then((data) =>
        setStats({
          totalCompetitions: data.totalCompetitions,
          pendingRegistrations: data.pendingRegistrations,
          totalRegistrations: data.totalRegistrations,
        }),
      )
      .catch(() => setError("Failed to load dashboard stats"))
      .finally(() => setLoading(false));
  }, []);

  const links = [
    {
      href: "/admin/competitions",
      title: "Manage Competitions",
      description: "Create, edit, and manage competitions",
      icon: Trophy,
    },
    {
      href: "/admin/registrations",
      title: "Registrations",
      description: "Approve or reject registration requests",
      icon: ClipboardList,
    },
    {
      href: "/admin/support",
      title: "Support Chat",
      description: "Handle user support conversations",
      icon: MessageCircle,
    },
    {
      href: "/admin/analytics",
      title: "Analytics",
      description: "Charts and overview",
      icon: BarChart3,
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Welcome back{user?.displayName ? `, ${user.displayName}` : ""}
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : error ? (
        <Card className="border-amber-200 bg-amber-50/50">
          <CardContent className="flex items-center gap-3 py-6">
            <AlertCircle className="h-8 w-8 text-amber-600" />
            <p className="text-amber-800">{error}</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Competitions
              </CardTitle>
              <Trophy className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalCompetitions ?? 0}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Pending Registrations
              </CardTitle>
              <ClipboardList className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.pendingRegistrations ?? 0}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Need your review
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Registrations
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalRegistrations ?? 0}</div>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {links.map((item) => (
          <Link key={item.href} href={item.href}>
            <Card className="h-full transition-colors hover:bg-muted/50">
              <CardHeader className="flex flex-row items-center gap-2">
                <item.icon className="h-5 w-5 text-primary" />
                <CardTitle className="text-base">{item.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="mb-2">{item.description}</CardDescription>
                <Button variant="ghost" size="sm" className="h-8 px-0">
                  Open <ArrowRight className="ml-1 h-3 w-3" />
                </Button>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
