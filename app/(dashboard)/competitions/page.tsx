'use client';

import { useState, useEffect } from 'react';
import { CompetitionsGrid } from '@/components/competitions/competitions-grid';
import { CompetitionFilters } from '@/components/competitions/competition-filters';
import { competitionApi } from '@/lib/competition-api';

interface CompetitionFilters {
  search?: string;
  category?: string;
  status?: string;
}

export default function CompetitionsPage() {
  const [competitions, setCompetitions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<CompetitionFilters>({});

  useEffect(() => {
    const loadCompetitions = async () => {
      try {
        setIsLoading(true);
        const data = await competitionApi.getCompetitions({
          ...filters,
          limit: 12,
          page: 1,
        });
        setCompetitions(data.data || []);
      } catch (error) {
        console.error('Failed to load competitions:', error);
        setCompetitions([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadCompetitions();
  }, [filters]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Explore Competitions</h1>
        <p className="text-gray-600">Browse and register for competitions across various categories</p>
      </div>

      <CompetitionFilters onFilterChange={setFilters} />

      <CompetitionsGrid
        competitions={competitions}
        isLoading={isLoading}
        isEmpty={!isLoading && competitions.length === 0}
      />
    </div>
  );
}
