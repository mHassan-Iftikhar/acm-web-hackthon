"use client";

import { useState, useEffect } from "react";
import { discoveryService, type DiscoveryCompetition } from "@/lib/discovery-service";
import { CompetitionCard } from "@/components/competitions/competition-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Flame } from "lucide-react";

function normalizeForCard(c: DiscoveryCompetition) {
  return {
    _id: c._id,
    title: c.title,
    shortDescription: c.shortDescription ?? c.description?.slice(0, 120) ?? "",
    category: c.category ?? { _id: "", name: "General", icon: "📌" },
    startDate: c.startDate,
    endDate: c.endDate,
    registrationDeadline: c.registrationDeadline,
    maxParticipants: c.maxParticipants ?? 0,
    registeredCount: c.registeredCount ?? 0,
    venue: c.venue,
    status: c.status,
  };
}

export function PopularCompetitions() {
  const [competitions, setCompetitions] = useState<DiscoveryCompetition[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    discoveryService
      .getPopular(8)
      .then(setCompetitions)
      .catch(() => setCompetitions([]))
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return (
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <Flame className="h-6 w-6 text-orange-500" />
          <h2 className="text-xl font-semibold font-walsheim">Most popular</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-48 w-full rounded-lg" />
          ))}
        </div>
      </section>
    );
  }

  if (competitions.length === 0) {
    return (
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <Flame className="h-6 w-6 text-orange-500" />
          <h2 className="text-xl font-semibold font-walsheim">Most popular</h2>
        </div>
        <p className="text-muted-foreground text-sm">No popular competitions yet.</p>
      </section>
    );
  }

  return (
    <section className="space-y-4">
      <div className="flex items-center gap-2">
        <Flame className="h-6 w-6 text-orange-500" />
        <h2 className="text-xl font-semibold font-walsheim">Most popular</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {competitions.map((c) => {
          const card = normalizeForCard(c);
          return (
            <CompetitionCard
              key={c._id}
              id={card._id}
              title={card.title}
              shortDescription={card.shortDescription}
              category={card.category}
              startDate={card.startDate}
              endDate={card.endDate}
              registrationDeadline={card.registrationDeadline}
              maxParticipants={card.maxParticipants}
              registeredCount={card.registeredCount}
              venue={card.venue}
              status={card.status}
            />
          );
        })}
      </div>
    </section>
  );
}
