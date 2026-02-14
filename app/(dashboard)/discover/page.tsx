'use client';

import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CompetitionsGrid } from '@/components/competitions/competitions-grid';
import { CalendarView } from '@/components/competitions/calendar-view';
import { AgendaList } from '@/components/competitions/agenda-list';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default function DiscoverPage() {
    const [trendingCompetitions, setTrendingCompetitions] = useState([]);
    const [popularCompetitions, setPopularCompetitions] = useState([]);
    const [newCompetitions, setNewCompetitions] = useState([]);
    const [upcomingCompetitions, setUpcomingCompetitions] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchDiscoveryData();
    }, []);

    const fetchDiscoveryData = async () => {
        setLoading(true);
        try {
            const [trending, popular, newComps, upcoming] = await Promise.all([
                axios.get(`${API_URL}/api/competitions/discover/trending?limit=12`),
                axios.get(`${API_URL}/api/competitions/discover/popular?limit=12`),
                axios.get(`${API_URL}/api/competitions/discover/new?limit=12`),
                axios.get(`${API_URL}/api/competitions/discover/upcoming?limit=12`),
            ]);

            setTrendingCompetitions(trending.data.data);
            setPopularCompetitions(popular.data.data);
            setNewCompetitions(newComps.data.data);
            setUpcomingCompetitions(upcoming.data.data);
        } catch (error) {
            console.error('Failed to fetch discovery data:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
                <h1 className="text-4xl font-bold mb-2">Discover Competitions</h1>
                <p className="text-muted-foreground">
                    Find trending, popular, and upcoming competitions
                </p>
            </div>

            <Tabs defaultValue="trending" className="w-full">
                <TabsList className="grid w-full grid-cols-5 lg:w-auto">
                    <TabsTrigger value="trending">🔥 Trending</TabsTrigger>
                    <TabsTrigger value="popular">⭐ Popular</TabsTrigger>
                    <TabsTrigger value="new">✨ New</TabsTrigger>
                    <TabsTrigger value="upcoming">📅 Upcoming</TabsTrigger>
                    <TabsTrigger value="calendar">🗓️ Calendar</TabsTrigger>
                </TabsList>

                <TabsContent value="trending" className="mt-6">
                    <div className="mb-4">
                        <h2 className="text-2xl font-semibold">Trending Now</h2>
                        <p className="text-sm text-muted-foreground">
                            Competitions gaining momentum in the last 7 days
                        </p>
                    </div>
                    <CompetitionsGrid competitions={trendingCompetitions} isLoading={loading} />
                </TabsContent>

                <TabsContent value="popular" className="mt-6">
                    <div className="mb-4">
                        <h2 className="text-2xl font-semibold">Most Popular</h2>
                        <p className="text-sm text-muted-foreground">
                            Competitions with the highest registration counts
                        </p>
                    </div>
                    <CompetitionsGrid competitions={popularCompetitions} isLoading={loading} />
                </TabsContent>

                <TabsContent value="new" className="mt-6">
                    <div className="mb-4">
                        <h2 className="text-2xl font-semibold">Newly Added</h2>
                        <p className="text-sm text-muted-foreground">
                            Recently created competitions in the last 14 days
                        </p>
                    </div>
                    <CompetitionsGrid competitions={newCompetitions} isLoading={loading} />
                </TabsContent>

                <TabsContent value="upcoming" className="mt-6">
                    <div className="mb-4">
                        <h2 className="text-2xl font-semibold">Starting Soon</h2>
                        <p className="text-sm text-muted-foreground">
                            Competitions starting in the next 30 days
                        </p>
                    </div>
                    <CompetitionsGrid competitions={upcomingCompetitions} isLoading={loading} />
                </TabsContent>

                <TabsContent value="calendar" className="mt-6">
                    <div className="mb-4">
                        <h2 className="text-2xl font-semibold">Calendar View</h2>
                        <p className="text-sm text-muted-foreground">
                            View competitions in a calendar format and agenda list
                        </p>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2">
                            <CalendarView />
                        </div>
                        <div>
                            <AgendaList days={30} />
                        </div>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}

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
