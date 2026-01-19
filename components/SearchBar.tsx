// components/searchbar.tsx
'use client';

import { useState, useEffect } from 'react';
import { Search, MapPin, Filter, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface SearchFilters {
  query: string;
  location: string;
  category: string;
  jobType: string;
  minPay: string;
  maxPay: string;
  radius: string;
}

interface SearchBarProps {
  onSearch?: (filters: SearchFilters) => void;
  initialFilters?: Partial<SearchFilters>;
  compact?: boolean;
}

const categories = [
  'All Categories',
  'Delivery',
  'Cleaning',
  'Gardening',
  'Moving',
  'Tutoring',
  'Repair',
  'Construction',
  'Event Staff',
  'Pet Care',
  'Other'
];

const jobTypes = [
  'Any Type',
  'Casual',
  'Long Term',
  'One Time'
];

const radiusOptions = [
  { value: '1', label: '1 km' },
  { value: '5', label: '5 km' },
  { value: '10', label: '10 km' },
  { value: '25', label: '25 km' },
  { value: '50', label: '50 km' },
  { value: '100', label: '100+ km' }
];

export default function SearchBar({ onSearch, initialFilters, compact = false }: SearchBarProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    location: '',
    category: 'All Categories',
    jobType: 'Any Type',
    minPay: '',
    maxPay: '',
    radius: '10',
    ...initialFilters
  });

  useEffect(() => {
    if (navigator.geolocation && !filters.location) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // In a real app, reverse geocode to get location name
          setFilters(prev => ({
            ...prev,
            location: 'Near me'
          }));
        },
        () => {
          // User denied location or error
        }
      );
    }
  }, [filters.location]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(filters);
  };

  const handleReset = () => {
    const resetFilters = {
      query: '',
      location: '',
      category: 'All Categories',
      jobType: 'Any Type',
      minPay: '',
      maxPay: '',
      radius: '10'
    };
    setFilters(resetFilters);
    onSearch?.(resetFilters);
  };

  const hasActiveFilters = Object.entries(filters).some(
    ([key, value]) => 
      key !== 'radius' && 
      value !== '' && 
      value !== 'All Categories' && 
      value !== 'Any Type'
  );

  return (
    <div className="w-full">
      <form onSubmit={handleSearch} className="space-y-4">
        {/* Main Search */}
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={filters.query}
                onChange={(e) => setFilters({ ...filters, query: e.target.value })}
                placeholder="Search jobs, skills, or keywords..."
                className="input-field pl-10"
              />
            </div>
          </div>
          
          <div className="flex-1">
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={filters.location}
                onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                placeholder="City, state, or zip code"
                className="input-field pl-10"
              />
            </div>
          </div>
          
          <div className="flex gap-3">
            <Button type="submit" className="btn-primary flex-1">
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="flex items-center gap-2"
            >
              <Filter className="h-4 w-4" />
              Filters
              {hasActiveFilters && (
                <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
              )}
            </Button>
          </div>
        </div>

        {/* Advanced Filters */}
        {showAdvanced && (
          <div className="card p-4 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold">Advanced Filters</h3>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleReset}
                >
                  <X className="h-4 w-4 mr-1" />
                  Reset
                </Button>
                <Button
                  type="button"
                  size="sm"
                  onClick={() => setShowAdvanced(false)}
                >
                  Apply Filters
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Category
                </label>
                <select
                  value={filters.category}
                  onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                  className="input-field"
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Job Type
                </label>
                <select
                  value={filters.jobType}
                  onChange={(e) => setFilters({ ...filters, jobType: e.target.value })}
                  className="input-field"
                >
                  {jobTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Search Radius
                </label>
                <select
                  value={filters.radius}
                  onChange={(e) => setFilters({ ...filters, radius: e.target.value })}
                  className="input-field"
                >
                  {radiusOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Minimum Pay
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2">$</span>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={filters.minPay}
                    onChange={(e) => setFilters({ ...filters, minPay: e.target.value })}
                    placeholder="0.00"
                    className="input-field pl-8"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Maximum Pay
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2">$</span>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={filters.maxPay}
                    onChange={(e) => setFilters({ ...filters, maxPay: e.target.value })}
                    placeholder="No limit"
                    className="input-field pl-8"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Active Filters */}
        {hasActiveFilters && !showAdvanced && (
          <div className="flex flex-wrap gap-2">
            {filters.query && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                {filters.query}
                <button
                  onClick={() => setFilters({ ...filters, query: '' })}
                  className="hover:text-blue-900"
                >
                  ×
                </button>
              </span>
            )}
            {filters.location && filters.location !== 'Near me' && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                <MapPin className="h-3 w-3" />
                {filters.location}
                <button
                  onClick={() => setFilters({ ...filters, location: '' })}
                  className="hover:text-green-900"
                >
                  ×
                </button>
              </span>
            )}
            {filters.category !== 'All Categories' && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                {filters.category}
                <button
                  onClick={() => setFilters({ ...filters, category: 'All Categories' })}
                  className="hover:text-purple-900"
                >
                  ×
                </button>
              </span>
            )}
            {filters.jobType !== 'Any Type' && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">
                {filters.jobType}
                <button
                  onClick={() => setFilters({ ...filters, jobType: 'Any Type' })}
                  className="hover:text-yellow-900"
                >
                  ×
                </button>
              </span>
            )}
            {(filters.minPay || filters.maxPay) && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm">
                ${filters.minPay || '0'}-${filters.maxPay || '∞'}
                <button
                  onClick={() => setFilters({ ...filters, minPay: '', maxPay: '' })}
                  className="hover:text-red-900"
                >
                  ×
                </button>
              </span>
            )}
          </div>
        )}
      </form>

      {/* Compact version for small screens */}
      {compact && (
        <div className="md:hidden mt-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={filters.query}
              onChange={(e) => setFilters({ ...filters, query: e.target.value })}
              placeholder="Search jobs..."
              className="input-field pl-10"
              onKeyDown={(e) => e.key === 'Enter' && handleSearch(e)}
            />
            <Button
              type="button"
              onClick={handleSearch}
              className="absolute right-1 top-1/2 transform -translate-y-1/2"
              size="sm"
            >
              Go
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}