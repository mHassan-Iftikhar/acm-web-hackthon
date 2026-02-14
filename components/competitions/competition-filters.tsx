'use client';

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search } from 'lucide-react';
import { categoryApi } from '@/lib/competition-api';

interface Category {
  _id: string;
  name: string;
  icon: string;
}

interface CompetitionFiltersProps {
  onFilterChange: (filters: {
    search?: string;
    category?: string;
    status?: string;
  }) => void;
}

export function CompetitionFilters({ onFilterChange }: CompetitionFiltersProps) {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [status, setStatus] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        setIsLoadingCategories(true);
        const data = await categoryApi.getCategories();
        setCategories(data);
      } catch (error) {
        console.error('Failed to load categories:', error);
      } finally {
        setIsLoadingCategories(false);
      }
    };

    loadCategories();
  }, []);

  const handleFilterChange = () => {
    onFilterChange({
      search: search || undefined,
      category: category || undefined,
      status: status || undefined,
    });
  };

  useEffect(() => {
    const timer = setTimeout(handleFilterChange, 300);
    return () => clearTimeout(timer);
  }, [search, category, status]);

  const handleClearFilters = () => {
    setSearch('');
    setCategory('');
    setStatus('');
    onFilterChange({});
  };

  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-end">
      {/* Search */}
      <div className="flex-1">
        <label className="text-sm font-medium mb-2 block">Search Competitions</label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            type="text"
            placeholder="Search by title or description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Category Filter */}
      <div className="w-full md:w-48">
        <label className="text-sm font-medium mb-2 block">Category</label>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger>
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Categories</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat._id} value={cat._id}>
                {cat.icon} {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Status Filter */}
      <div className="w-full md:w-48">
        <label className="text-sm font-medium mb-2 block">Status</label>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger>
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Status</SelectItem>
            <SelectItem value="registration_open">Registration Open</SelectItem>
            <SelectItem value="registration_closed">Registration Closed</SelectItem>
            <SelectItem value="ongoing">Ongoing</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Clear Button */}
      <Button variant="outline" onClick={handleClearFilters} className="w-full md:w-auto">
        Clear Filters
      </Button>
    </div>
  );
}
