"use client";

import { useState, useEffect } from "react";
import { competitionApi } from "@/lib/competition-api";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { Calendar, Clock, Trophy } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

export default function UserDashboardPage() {
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadRegistrations = async () => {
      try {
        setIsLoading(true);
        const data = await competitionApi.getMyRegistrations();
        setRegistrations(data);
      } catch (error) {
        toast.error("Failed to load your registrations");
      } finally {
        setIsLoading(false);
      }
    };

    loadRegistrations();
  }, []);

  const statusColor = {
    pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
    approved: "bg-green-100 text-green-800 border-green-200",
    rejected: "bg-red-100 text-red-800 border-red-200",
    withdrawn: "bg-gray-100 text-gray-800 border-gray-200",
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-48" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-48 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">User Dashboard</h1>
        <p className="text-muted-foreground">
          Manage your competition registrations and track your progress.
        </p>
      </div>

      <div className="space-y-6">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Trophy className="h-5 w-5 text-blue-600" />
          My Registrations
        </h2>

        {registrations.length === 0 ? (
          <Card className="bg-gray-50 border-dashed">
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground mb-4">
                You haven't registered for any competitions yet.
              </p>
              <Link href="/competitions">
                <Badge
                  variant="outline"
                  className="cursor-pointer hover:bg-blue-50"
                >
                  Browse Competitions
                </Badge>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {registrations.map((reg) => (
              <Card
                key={reg._id}
                className="overflow-hidden hover:shadow-md transition-shadow"
              >
                <CardHeader className="pb-3 px-4">
                  <div className="flex justify-between items-start gap-2">
                    <CardTitle className="text-lg line-clamp-1">
                      {reg.competition?.title}
                    </CardTitle>
                    <Badge
                      className={
                        statusColor[reg.status as keyof typeof statusColor]
                      }
                    >
                      {reg.status.charAt(0)?.toUpperCase() +
                        reg.status.slice(1)}
                    </Badge>
                  </div>
                  <CardDescription className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {format(
                      new Date(reg.competition?.startDate),
                      "MMM dd, yyyy",
                    )}
                  </CardDescription>
                </CardHeader>
                <CardContent className="px-4 pb-4 space-y-3">
                  <div className="text-sm">
                    <span className="font-medium text-gray-600">Team: </span>
                    {reg.teamName || "Solo"}
                  </div>
                  <div className="text-sm">
                    <span className="font-medium text-gray-600">Members: </span>
                    {reg.memberNames.join(", ")}
                  </div>
                  {reg.rejectionReason && (
                    <div className="text-xs text-red-600 bg-red-50 p-2 rounded">
                      <span className="font-semibold">Reason: </span>
                      {reg.rejectionReason}
                    </div>
                  )}
                  <div className="pt-2">
                    <Link href={`/competitions/${reg.competition?._id}`}>
                      <Badge
                        variant="outline"
                        className="w-full justify-center py-1 cursor-pointer"
                      >
                        View Details
                      </Badge>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
