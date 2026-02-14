"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { competitionApi } from "@/lib/competition-api";
import { Button } from "@/components/ui/button";
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
import { Calendar, MapPin, Users, DollarSign, Clock } from "lucide-react";
import { toast } from "sonner";
import { RegistrationModal } from "@/components/competitions/registration-modal";

export default function CompetitionDetailPage() {
  const params = useParams();
  const competitionId = params.id as string;
  const [competition, setCompetition] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadCompetition = async () => {
      try {
        setIsLoading(true);
        const data = await competitionApi.getCompetition(competitionId);
        setCompetition(data);
      } catch (error) {
        toast.error("Failed to load competition");
      } finally {
        setIsLoading(false);
      }
    };

    if (competitionId) {
      loadCompetition();
    }
  }, [competitionId]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  if (!competition) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-gray-500">Competition not found</p>
      </div>
    );
  }

  const statusColor = {
    draft: "bg-gray-100 text-gray-800",
    registration_open: "bg-green-100 text-green-800",
    registration_closed: "bg-yellow-100 text-yellow-800",
    ongoing: "bg-blue-100 text-blue-800",
    completed: "bg-gray-100 text-gray-800",
    cancelled: "bg-red-100 text-red-800",
  };

  const statusLabel = {
    draft: "Draft",
    registration_open: "Registration Open",
    registration_closed: "Registration Closed",
    ongoing: "Ongoing",
    completed: "Completed",
    cancelled: "Cancelled",
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <h1 className="text-4xl font-bold tracking-tight mb-2">
            {competition.title}
          </h1>
          <div className="flex items-center gap-4 flex-wrap">
            <Badge
              className={
                statusColor[competition.status as keyof typeof statusColor]
              }
            >
              {statusLabel[competition.status as keyof typeof statusLabel]}
            </Badge>
            <span className="text-lg text-gray-600">
              {competition.category?.icon} {competition.category?.name}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Description */}
          <Card>
            <CardHeader>
              <CardTitle>About</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 whitespace-pre-wrap">
                {competition.description}
              </p>
            </CardContent>
          </Card>

          {/* Rules */}
          {competition.rules && (
            <Card>
              <CardHeader>
                <CardTitle>Rules & Guidelines</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 whitespace-pre-wrap">
                  {competition.rules}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Prizes */}
          {competition.prizes && (
            <Card>
              <CardHeader>
                <CardTitle>Prizes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 whitespace-pre-wrap">
                  {competition.prizes}
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Key Info Card */}
          <Card>
            <CardHeader>
              <CardTitle>Competition Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex items-center gap-2 text-gray-600 mb-1">
                  <Calendar className="h-4 w-4" />
                  <span className="text-sm font-medium">Start Date</span>
                </div>
                <p className="text-sm font-semibold">
                  {format(
                    new Date(competition.startDate),
                    "MMM dd, yyyy HH:mm",
                  )}
                </p>
              </div>

              <div>
                <div className="flex items-center gap-2 text-gray-600 mb-1">
                  <Clock className="h-4 w-4" />
                  <span className="text-sm font-medium">End Date</span>
                </div>
                <p className="text-sm font-semibold">
                  {format(new Date(competition.endDate), "MMM dd, yyyy HH:mm")}
                </p>
              </div>

              <div>
                <div className="flex items-center gap-2 text-gray-600 mb-1">
                  <Clock className="h-4 w-4" />
                  <span className="text-sm font-medium">
                    Registration Deadline
                  </span>
                </div>
                <p className="text-sm font-semibold">
                  {format(
                    new Date(competition.registrationDeadline),
                    "MMM dd, yyyy HH:mm",
                  )}
                </p>
              </div>

              <div>
                <div className="flex items-center gap-2 text-gray-600 mb-1">
                  <MapPin className="h-4 w-4" />
                  <span className="text-sm font-medium">Venue</span>
                </div>
                <p className="text-sm font-semibold">{competition.venue}</p>
              </div>

              <div>
                <div className="flex items-center gap-2 text-gray-600 mb-1">
                  <Users className="h-4 w-4" />
                  <span className="text-sm font-medium">Participants</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-full rounded-full"
                      style={{
                        width: `${(competition.registeredCount / competition.maxParticipants) * 100}%`,
                      }}
                    />
                  </div>
                  <p className="text-sm font-semibold">
                    {competition.registeredCount}/{competition.maxParticipants}
                  </p>
                </div>
              </div>

              {competition.entryFee > 0 && (
                <div>
                  <div className="flex items-center gap-2 text-gray-600 mb-1">
                    <DollarSign className="h-4 w-4" />
                    <span className="text-sm font-medium">Entry Fee</span>
                  </div>
                  <p className="text-sm font-semibold">
                    ₹{competition.entryFee}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Register Button */}
          {competition.status === "registration_open" && (
            <RegistrationModal
              competitionId={competitionId}
              competitionTitle={competition.title}
              onSuccess={() => {
                // Refresh competition data to update registration count
                competitionApi
                  .getCompetition(competitionId)
                  .then(setCompetition);
              }}
            />
          )}

          {competition.status !== "registration_open" && (
            <Button disabled className="w-full" size="lg">
              {competition.status === "registration_closed"
                ? "Registration Closed"
                : "Not Available"}
            </Button>
          )}

          {/* Organizer Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Organizer</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="font-semibold">
                  {competition.organizer?.name || "N/A"}
                </p>
                <p className="text-sm text-gray-600">
                  {competition.organizer?.email || "N/A"}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
