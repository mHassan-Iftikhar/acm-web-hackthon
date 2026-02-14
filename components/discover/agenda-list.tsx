"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  discoveryService,
  type DiscoveryCompetition,
} from "@/lib/discovery-service";
import { format, parseISO } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { ListTodo, MapPin, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function AgendaList() {
  const [competitions, setCompetitions] = useState<DiscoveryCompetition[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    discoveryService
      .getUpcoming(20)
      .then(setCompetitions)
      .catch(() => setCompetitions([]))
      .finally(() => setIsLoading(false));
  }, []);

  const grouped = (() => {
    const map = new Map<string, DiscoveryCompetition[]>();
    competitions.forEach((c) => {
      try {
        const d =
          typeof c.startDate === "string"
            ? parseISO(c.startDate)
            : new Date(c.startDate);
        const key = format(d, "yyyy-MM-dd");
        if (!map.has(key)) map.set(key, []);
        map.get(key)!.push(c);
      } catch {
        // skip
      }
    });
    return Array.from(map.entries()).sort(([a], [b]) => a.localeCompare(b));
  })();

  if (isLoading) {
    return (
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <ListTodo className="h-6 w-6 text-blue-600" />
          <h2 className="text-xl font-semibold font-walsheim">Agenda</h2>
        </div>
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-20 w-full rounded-lg" />
          ))}
        </div>
      </section>
    );
  }

  if (competitions.length === 0) {
    return (
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <ListTodo className="h-6 w-6 text-blue-600" />
          <h2 className="text-xl font-semibold font-walsheim">Agenda</h2>
        </div>
        <p className="text-muted-foreground text-sm">No upcoming competitions.</p>
      </section>
    );
  }

  return (
    <section className="space-y-4">
      <div className="flex items-center gap-2">
        <ListTodo className="h-6 w-6 text-blue-600" />
        <h2 className="text-xl font-semibold font-walsheim">Agenda</h2>
      </div>
      <div className="space-y-6">
        {grouped.map(([dateKey, list]) => (
          <div key={dateKey}>
            <h3 className="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              {format(parseISO(dateKey), "EEEE, MMM d, yyyy")}
            </h3>
            <ul className="space-y-2">
              {list.map((c) => (
                <li key={c._id}>
                  <Link
                    href={`/competitions/${c._id}`}
                    className="block rounded-lg border border-slate-200 bg-white p-4 hover:border-blue-300 hover:shadow-sm transition"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-slate-900 truncate">
                          {c.title}
                        </p>
                        <div className="flex items-center gap-2 mt-1 text-sm text-slate-500">
                          <MapPin className="h-3.5 w-3.5 shrink-0" />
                          <span className="truncate">{c.venue}</span>
                        </div>
                        <p className="text-xs text-slate-500 mt-1">
                          {format(
                            typeof c.startDate === "string"
                              ? parseISO(c.startDate)
                              : new Date(c.startDate),
                            "h:mm a",
                          )}
                        </p>
                      </div>
                      <Badge
                        variant="secondary"
                        className="shrink-0 text-xs"
                      >
                        {c.category?.name ?? "General"}
                      </Badge>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
