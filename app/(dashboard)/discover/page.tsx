"use client";

import { TrendingCompetitions } from "@/components/discover/trending-competitions";
import { PopularCompetitions } from "@/components/discover/popular-competitions";
import { CalendarView } from "@/components/discover/calendar-view";
import { AgendaList } from "@/components/discover/agenda-list";
import { Compass } from "lucide-react";

export default function DiscoverPage() {
  return (
    <div className="space-y-12">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2 flex items-center gap-2 font-walsheim">
          <Compass className="h-8 w-8 text-blue-600" />
          Discover
        </h1>
        <p className="text-muted-foreground">
          Find trending, popular, and upcoming competitions. Plan with the calendar and agenda.
        </p>
      </div>

      <TrendingCompetitions />
      <PopularCompetitions />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <CalendarView />
        </div>
        <div className="lg:col-span-2">
          <AgendaList />
        </div>
      </div>
    </div>
  );
}
