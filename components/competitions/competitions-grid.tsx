'use client';

import { CompetitionCard } from './competition-card';
import { Skeleton } from '@/components/ui/skeleton';

interface Competition {
  _id: string;
  title: string;
  shortDescription: string;
  category: {
    _id: string;
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

interface CompetitionsGridProps {
  competitions: Competition[];
  isLoading?: boolean;
  isEmpty?: boolean;
}

export function CompetitionsGrid({
  competitions,
  isLoading = false,
  isEmpty = false,
}: CompetitionsGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="space-y-4">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  if (isEmpty) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-gray-500 mb-4">No competitions found</p>
        <p className="text-sm text-gray-400">Try adjusting your filters or check back later</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {competitions.map((competition) => (
        <CompetitionCard
          key={competition._id}
          id={competition._id}
          title={competition.title}
          shortDescription={competition.shortDescription}
          category={competition.category}
          startDate={competition.startDate}
          endDate={competition.endDate}
          registrationDeadline={competition.registrationDeadline}
          maxParticipants={competition.maxParticipants}
          registeredCount={competition.registeredCount}
          venue={competition.venue}
          status={competition.status}
        />
      ))}
    </div>
  );
}
