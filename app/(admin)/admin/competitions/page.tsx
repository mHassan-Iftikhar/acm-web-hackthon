'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { competitionApi } from '@/lib/competition-api';
import { CompetitionForm } from '@/components/admin/competition-form';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { format } from 'date-fns';
import { Edit2, Trash2, Eye } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminCompetitionsPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [competitions, setCompetitions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCompetition, setEditingCompetition] = useState<any>(null);

  useEffect(() => {
    if (user?.role !== 'organizer' && user?.role !== 'admin') {
      router.push('/dashboard');
      return;
    }

    loadCompetitions();
  }, [user, router]);

  const loadCompetitions = async () => {
    try {
      setIsLoading(true);
      const data = await competitionApi.getMyCompetitions(100, 1);
      setCompetitions(data.data || []);
    } catch (error) {
      toast.error('Failed to load competitions');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this competition?')) {
      try {
        await competitionApi.deleteCompetition(id);
        setCompetitions(competitions.filter((c) => c._id !== id));
        toast.success('Competition deleted');
      } catch (error) {
        toast.error('Failed to delete competition');
      }
    }
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingCompetition(null);
    loadCompetitions();
  };

  const statusColor = {
    draft: 'bg-gray-100 text-gray-800',
    registration_open: 'bg-green-100 text-green-800',
    registration_closed: 'bg-yellow-100 text-yellow-800',
    ongoing: 'bg-blue-100 text-blue-800',
    completed: 'bg-gray-100 text-gray-800',
    cancelled: 'bg-red-100 text-red-800',
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Manage Competitions</h1>
          <p className="text-gray-600 mt-1">Create and manage your competitions</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          {showForm ? 'View Competitions' : 'Create New Competition'}
        </Button>
      </div>

      {showForm && (
        <div className="mb-6">
          <CompetitionForm
            initialData={editingCompetition}
            onSuccess={handleFormSuccess}
          />
        </div>
      )}

      {!showForm && (
        <Card>
          <CardHeader>
            <CardTitle>Your Competitions</CardTitle>
            <CardDescription>Total: {competitions.length} competitions</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">Loading...</div>
            ) : competitions.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">No competitions created yet</p>
                <Button onClick={() => setShowForm(true)}>Create Your First Competition</Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Start Date</TableHead>
                      <TableHead>Registered</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {competitions.map((competition) => (
                      <TableRow key={competition._id}>
                        <TableCell className="font-medium line-clamp-1">
                          {competition.title}
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-gray-600">
                            {competition.category?.icon} {competition.category?.name}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Badge className={statusColor[competition.status as keyof typeof statusColor]}>
                            {competition.status.replace('_', ' ').toUpperCase()}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-gray-600">
                          {format(new Date(competition.startDate), 'MMM dd, yyyy')}
                        </TableCell>
                        <TableCell className="text-sm">
                          {competition.registeredCount}/{competition.maxParticipants}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => router.push(`/competitions/${competition._id}`)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setEditingCompetition(competition);
                                setShowForm(true);
                              }}
                            >
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDelete(competition._id)}
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
