"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  MapPin,
  Calendar,
  Clock,
  Trophy,
  Target,
} from "lucide-react";
import { events } from "@/lib/data/events";

interface UpcomingEventsProps {
  limit?: number;
}

export const UpcomingEvents = ({ limit = 3 }: UpcomingEventsProps) => {
  const displayedEvents = events.slice(0, limit);

  return (
    <div className="w-full min-h-fit pb-20 flex justify-center items-center">
      <div className="w-[90%] md:w-full max-w-6xl flex flex-col gap-8 md:gap-12 px-5">
        <h1 className="text-3xl md:text-5xl font-bold text-slate-900 font-walsheim text-center">
          Upcoming <span className="text-blue-600">Events</span>
        </h1>

        {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayedEvents.map((event) => (
            <Link
              key={event.slug}
              href={
                event.slug === "ucp-taakra-2026"
                  ? "/events/ucp-taakra-2026"
                  : `/events/${event.slug}`
              }
              className="flex flex-col gap-4 hover:opacity-80 transition-opacity group"
            >
              <div className="w-full aspect-video overflow-hidden rounded-3xl bg-gray-100 relative">
                <Image
                  src={event.image}
                  alt={event.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex flex-row gap-2 items-center text-sm text-slate-600 font-inter">
                  <MapPin className="h-4 w-4 text-slate-400" />
                  <p>{event.location}</p>
                </div>

                <p className="text-xl font-semibold text-blue-600 font-walsheim">
                  {event.title}
                </p>

                <div className="flex gap-4 text-sm text-slate-600 font-inter">
                  <div className="flex flex-row gap-2 items-center">
                    <Calendar className="h-4 w-4 text-slate-400" />
                    <p>{event.date}</p>
                  </div>
                  <div className="flex flex-row gap-2 items-center">
                    <Clock className="h-4 w-4 text-slate-400" />
                    <p>{event.time}</p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div> */}

        {/* UCP Taakra 2026 Card */}
        <div className="w-full max-w-md mt-6">
          <Link href="/events/ucp-taakra-2026">
            <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 hover:shadow-lg transition-all cursor-pointer group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Trophy className="h-24 w-24 text-blue-600" />
              </div>
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-blue-100 text-blue-700 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                    Featured Event
                  </span>
                  <span className="text-slate-500 text-xs flex items-center gap-1">
                    <Target className="h-3 w-3" /> UCP Lahore
                  </span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-1 group-hover:text-blue-600 transition-colors">
                  UCP Taakra 2026
                </h3>
                <p className="text-sm text-slate-600 mb-4">
                  The biggest tech battle of the year. Speed Programming, CTF,
                  Web Hackathon and more.
                </p>
                <div className="flex items-center text-sm font-medium text-blue-600 group-hover:underline">
                  View Details <ArrowRight className="ml-1 h-4 w-4" />
                </div>
              </div>
            </div>
          </Link>
        </div>
        <div className="w-max">
          <Link href="/competitions">
            <Button
              variant="outline"
              className="w-auto bg-transparent text-slate-900 font-bold pl-2 pr-1 py-6 text-sm rounded-full border border-slate-900 hover:border-blue-600 hover:bg-blue-600 hover:text-white transition-all cursor-pointer group"
            >
              <span className="px-4">View all Events</span>
              <div className="p-2 h-10 w-10 rounded-full flex items-center justify-center bg-blue-600 group-hover:bg-white transition-colors">
                <ArrowRight className="text-white group-hover:text-blue-600 -rotate-45" />
              </div>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
