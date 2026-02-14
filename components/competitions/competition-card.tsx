'use client';

import Link from 'next/link';
import { format } from 'date-fns';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Users } from 'lucide-react';

interface CompetitionCardProps {
  id: string;
  title: string;
  shortDescription: string;
  category: {
    name: string;
    icon: string;
  };
  startDate: string;
  endDate: string;
  registrationDeadline: string;
  maxParticipants: number;
  registeredCount: number;
  venue: string;
  status: string;
}

export function CompetitionCard({
  id,
  title,
  shortDescription,
  category,
  startDate,
  endDate,
  registrationDeadline,
  maxParticipants,
  registeredCount,
  venue,
  status,
}: CompetitionCardProps) {
  const statusColor = {
    draft: 'bg-gray-100 text-gray-800',
    registration_open: 'bg-green-100 text-green-800',
    registration_closed: 'bg-yellow-100 text-yellow-800',
    ongoing: 'bg-blue-100 text-blue-800',
    completed: 'bg-gray-100 text-gray-800',
    cancelled: 'bg-red-100 text-red-800',
  };

  const statusLabel = {
    draft: 'Draft',
    registration_open: 'Registration Open',
    registration_closed: 'Registration Closed',
    ongoing: 'Ongoing',
    completed: 'Completed',
    cancelled: 'Cancelled',
  };

  return (
    <Link href={`/competitions/${id}`}>
      <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
        <CardHeader>
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <CardTitle className="line-clamp-2">{title}</CardTitle>
              <CardDescription className="mt-1 flex items-center gap-1">
                <span className="text-lg">{category?.icon || '📚'}</span>
                {category?.name}
              </CardDescription>
            </div>
            <Badge className={statusColor[status as keyof typeof statusColor]}>
              {statusLabel[status as keyof typeof statusLabel]}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <p className="text-sm text-gray-600 line-clamp-2">{shortDescription}</p>

          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2 text-gray-700">
              <Calendar className="h-4 w-4" />
              <span>{format(new Date(startDate), 'MMM dd, yyyy')}</span>
            </div>

            <div className="flex items-center gap-2 text-gray-700">
              <MapPin className="h-4 w-4" />
              <span className="line-clamp-1">{venue}</span>
            </div>

            <div className="flex items-center gap-2 text-gray-700">
              <Users className="h-4 w-4" />
              <span>
                {registeredCount} / {maxParticipants} registered
              </span>
            </div>
          </div>

          <div className="pt-2 border-t">
            <p className="text-xs text-gray-500">
              Registration closes: {format(new Date(registrationDeadline), 'MMM dd, yyyy')}
            </p>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
