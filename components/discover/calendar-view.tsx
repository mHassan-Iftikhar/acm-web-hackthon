"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  discoveryService,
  type DiscoveryCompetition,
} from "@/lib/discovery-service";
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addMonths,
  subMonths,
  isSameMonth,
  parseISO,
} from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";

export function CalendarView() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [competitions, setCompetitions] = useState<DiscoveryCompetition[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    discoveryService
      .getUpcoming(50)
      .then(setCompetitions)
      .catch(() => setCompetitions([]))
      .finally(() => setIsLoading(false));
  }, []);

  const datesWithCompetitions = useMemo(() => {
    const set = new Set<string>();
    competitions.forEach((c) => {
      try {
        const d = typeof c.startDate === "string" ? parseISO(c.startDate) : new Date(c.startDate);
        set.add(format(d, "yyyy-MM-dd"));
      } catch {
        // ignore invalid dates
      }
    });
    return set;
  }, [competitions]);

  if (isLoading) {
    return (
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <CalendarIcon className="h-6 w-6 text-blue-600" />
          <h2 className="text-xl font-semibold font-walsheim">Calendar</h2>
        </div>
        <Skeleton className="h-80 w-full rounded-lg" />
      </section>
    );
  }

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });

  const weeks: Date[][] = [];
  let day = calendarStart;
  while (day <= calendarEnd) {
    const week: Date[] = [];
    for (let i = 0; i < 7; i++) {
      week.push(day);
      day = new Date(day);
      day.setDate(day.getDate() + 1);
    }
    weeks.push(week);
  }

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CalendarIcon className="h-6 w-6 text-blue-600" />
          <h2 className="text-xl font-semibold font-walsheim">Calendar</h2>
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setCurrentMonth((m) => subMonths(m, 1))}
            className="p-2 rounded-md hover:bg-slate-100 text-slate-600"
            aria-label="Previous month"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <span className="min-w-[140px] text-center font-medium text-slate-700">
            {format(currentMonth, "MMMM yyyy")}
          </span>
          <button
            type="button"
            onClick={() => setCurrentMonth((m) => addMonths(m, 1))}
            className="p-2 rounded-md hover:bg-slate-100 text-slate-600"
            aria-label="Next month"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white overflow-hidden">
        <div className="grid grid-cols-7 border-b border-slate-200 bg-slate-50">
          {dayNames.map((name) => (
            <div
              key={name}
              className="py-2 text-center text-xs font-medium text-slate-500"
            >
              {name}
            </div>
          ))}
        </div>
        {weeks.map((week, wi) => (
          <div key={wi} className="grid grid-cols-7">
            {week.map((d) => {
              const key = format(d, "yyyy-MM-dd");
              const inMonth = isSameMonth(d, currentMonth);
              const hasEvent = datesWithCompetitions.has(key);
              return (
                <div
                  key={key}
                  className={`min-h-12 p-1 border-b border-r border-slate-100 last:border-r-0 ${
                    inMonth ? "bg-white" : "bg-slate-50/50"
                  }`}
                >
                  <span
                    className={`inline-flex h-8 w-8 items-center justify-center rounded-full text-sm ${
                      inMonth ? "text-slate-800" : "text-slate-400"
                    } ${hasEvent ? "bg-blue-100 font-semibold text-blue-700" : ""}`}
                  >
                    {format(d, "d")}
                  </span>
                </div>
              );
            })}
          </div>
        ))}
      </div>
      {datesWithCompetitions.size > 0 && (
        <p className="text-xs text-muted-foreground">
          Days with competitions are highlighted. Use the agenda below for details.
        </p>
      )}
    </section>
  );
}
