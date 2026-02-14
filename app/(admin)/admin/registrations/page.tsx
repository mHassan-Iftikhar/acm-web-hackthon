"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { competitionApi } from "@/lib/competition-api";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { CheckCircle2, XCircle, AlertCircle, Loader2 } from "lucide-react";

export default function AdminRegistrationsPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [myCompetitions, setMyCompetitions] = useState<any[]>([]);
  const [selectedCompetition, setSelectedCompetition] = useState<string>("");
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState<string | null>(null);

  useEffect(() => {
    if (user?.role !== "organizer" && user?.role !== "admin") {
      router.push("/dashboard");
      return;
    }

    loadMyCompetitions();
  }, [user, router]);

  const loadMyCompetitions = async () => {
    try {
      setIsLoading(true);
      const data = await competitionApi.getMyCompetitions(100, 1);
      setMyCompetitions(data.data || []);
      if (data.data && data.data.length > 0) {
        setSelectedCompetition(data.data[0]._id);
      }
    } catch (error) {
      toast.error("Failed to load your competitions");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (selectedCompetition) {
      loadRegistrations(selectedCompetition);
    }
  }, [selectedCompetition]);

  const loadRegistrations = async (competitionId: string) => {
    try {
      setIsLoading(true);
      const data =
        await competitionApi.getCompetitionRegistrations(competitionId);
      setRegistrations(data || []);
    } catch (error) {
      toast.error("Failed to load registrations");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateStatus = async (
    registrationId: string,
    status: "approved" | "rejected",
  ) => {
    let rejectionReason = "";
    if (status === "rejected") {
      rejectionReason =
        prompt("Please enter a reason for rejection:") ||
        "Registration does not meet requirements";
    }

    try {
      setIsProcessing(registrationId);
      await competitionApi.updateRegistrationStatus(
        registrationId,
        status,
        rejectionReason,
      );
      toast.success(`Registration ${status}`);
      loadRegistrations(selectedCompetition);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update status");
    } finally {
      setIsProcessing(null);
    }
  };

  const statusColor = {
    pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
    approved: "bg-green-100 text-green-800 border-green-200",
    rejected: "bg-red-100 text-red-800 border-red-200",
    withdrawn: "bg-gray-100 text-gray-800 border-gray-200",
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Manage Registrations
          </h1>
          <p className="text-gray-600 mt-1">
            Review and approve registrations for your competitions
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <CardTitle>Registration Requests</CardTitle>
              <CardDescription>
                Select a competition to view its registrations
              </CardDescription>
            </div>
            <div className="w-full md:w-64">
              <Select
                value={selectedCompetition}
                onValueChange={setSelectedCompetition}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select competition" />
                </SelectTrigger>
                <SelectContent>
                  {myCompetitions.map((c) => (
                    <SelectItem key={c._id} value={c._id}>
                      {c.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-12 flex flex-col items-center justify-center gap-3">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              <p className="text-muted-foreground">Loading registrations...</p>
            </div>
          ) : registrations.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed text-muted-foreground">
              <AlertCircle className="h-8 w-8 mx-auto mb-2 text-gray-400" />
              <p>No registrations found for this competition.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Team Name</TableHead>
                    <TableHead>Members</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Applied On</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {registrations.map((reg) => (
                    <TableRow key={reg._id}>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium">
                            {reg.user?.name || "Unknown User"}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {reg.user?.email || "N/A"}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">
                        {reg.teamName || (
                          <span className="text-muted-foreground italic text-xs">
                            Individual
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {reg.memberNames.map((name: string, i: number) => (
                            <Badge
                              key={i}
                              variant="secondary"
                              className="text-[10px] font-normal py-0"
                            >
                              {name}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={`font-normal ${statusColor[reg.status as keyof typeof statusColor]}`}
                        >
                          {reg.status.toUpperCase()}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm">
                        {format(new Date(reg.createdAt), "MMM dd, HH:mm")}
                      </TableCell>
                      <TableCell className="text-right">
                        {reg.status === "pending" ? (
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 border-green-200 text-green-700 hover:bg-green-50"
                              disabled={isProcessing === reg._id}
                              onClick={() =>
                                handleUpdateStatus(reg._id, "approved")
                              }
                            >
                              <CheckCircle2 className="h-4 w-4 mr-1" /> Approve
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 border-red-200 text-red-700 hover:bg-red-50"
                              disabled={isProcessing === reg._id}
                              onClick={() =>
                                handleUpdateStatus(reg._id, "rejected")
                              }
                            >
                              <XCircle className="h-4 w-4 mr-1" /> Reject
                            </Button>
                          </div>
                        ) : (
                          <span className="text-xs text-muted-foreground italic">
                            Processed
                          </span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
