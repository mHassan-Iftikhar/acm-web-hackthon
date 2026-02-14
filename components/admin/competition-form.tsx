'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { competitionApi, categoryApi } from '@/lib/competition-api';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

const competitionSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title too long'),
  shortDescription: z.string().min(1, 'Short description is required').max(200),
  description: z.string().min(1, 'Description is required').max(2000),
  category: z.string().min(1, 'Category is required'),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),
  registrationDeadline: z.string().min(1, 'Registration deadline is required'),
  maxParticipants: z.coerce.number().min(1, 'Must allow at least 1 participant'),
  venue: z.string().min(1, 'Venue is required'),
  entryFee: z.coerce.number().min(0, 'Entry fee cannot be negative').optional(),
  rules: z.string().optional(),
  prizes: z.string().optional(),
});

type CompetitionFormData = z.infer<typeof competitionSchema>;

interface CompetitionFormProps {
  initialData?: any;
  onSuccess?: () => void;
}

export function CompetitionForm({ initialData, onSuccess }: CompetitionFormProps) {
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCategoriesLoading, setIsCategoriesLoading] = useState(true);

  const form = useForm<CompetitionFormData>({
    resolver: zodResolver(competitionSchema),
    defaultValues: initialData || {
      title: '',
      shortDescription: '',
      description: '',
      category: '',
      startDate: '',
      endDate: '',
      registrationDeadline: '',
      maxParticipants: 100,
      venue: '',
      entryFee: 0,
      rules: '',
      prizes: '',
    },
  });

  useEffect(() => {
    const loadCategories = async () => {
      try {
        setIsCategoriesLoading(true);
        const data = await categoryApi.getCategories();
        setCategories(data);
      } catch (error) {
        toast.error('Failed to load categories');
      } finally {
        setIsCategoriesLoading(false);
      }
    };

    loadCategories();
  }, []);

  const onSubmit = async (data: CompetitionFormData) => {
    try {
      setIsLoading(true);

      if (initialData?._id) {
        await competitionApi.updateCompetition(initialData._id, data);
        toast.success('Competition updated successfully');
      } else {
        await competitionApi.createCompetition(data);
        toast.success('Competition created successfully');
        form.reset();
      }

      onSuccess?.();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to save competition');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{initialData ? 'Edit Competition' : 'Create New Competition'}</CardTitle>
        <CardDescription>
          {initialData
            ? 'Update competition details'
            : 'Fill in the details to create a new competition'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Title */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Competition Title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., National Science Olympiad 2024" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Short Description */}
            <FormField
              control={form.control}
              name="shortDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Short Description</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Brief overview (max 200 characters)"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Full Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Detailed description of the competition"
                      className="min-h-32"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Category */}
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger disabled={isCategoriesLoading}>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat._id} value={cat._id}>
                          {cat.icon} {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Dates */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Date</FormLabel>
                    <FormControl>
                      <Input type="datetime-local" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End Date</FormLabel>
                    <FormControl>
                      <Input type="datetime-local" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="registrationDeadline"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Registration Deadline</FormLabel>
                    <FormControl>
                      <Input type="datetime-local" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Participants and Fee */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="maxParticipants"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Max Participants</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="100" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="entryFee"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Entry Fee (optional)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="0" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Venue */}
            <FormField
              control={form.control}
              name="venue"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Venue</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., School Auditorium, Room 101" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Rules */}
            <FormField
              control={form.control}
              name="rules"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rules (optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Competition rules and guidelines"
                      className="min-h-24"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Prizes */}
            <FormField
              control={form.control}
              name="prizes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Prizes (optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Prize details"
                      className="min-h-24"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {initialData ? 'Update Competition' : 'Create Competition'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
