// components/statsoverview.tsx
'use client';

import { TrendingUp, Users, DollarSign, Clock, MapPin, Award } from 'lucide-react';

interface StatsOverviewProps {
  stats?: {
    totalJobs?: number;
    activeUsers?: number;
    averageEarnings?: number;
    responseTime?: number;
    successRate?: number;
    locations?: number;
  };
}

export default function StatsOverview({ stats }: StatsOverviewProps) {
  const defaultStats = {
    totalJobs: 2456,
    activeUsers: 12340,
    averageEarnings: 25.50,
    responseTime: 2.4,
    successRate: 94,
    locations: 156,
    ...stats
  };

  const statCards = [
    {
      title: 'Total Jobs',
      value: defaultStats.totalJobs.toLocaleString(),
      icon: Award,
      color: 'bg-blue-500',
      change: '+12%',
      description: 'Posted this month'
    },
    {
      title: 'Active Users',
      value: defaultStats.activeUsers.toLocaleString(),
      icon: Users,
      color: 'bg-green-500',
      change: '+8%',
      description: 'Hustlers & employers'
    },
    {
      title: 'Avg Hourly Rate',
      value: `$${defaultStats.averageEarnings.toFixed(2)}`,
      icon: DollarSign,
      color: 'bg-purple-500',
      change: '+5%',
      description: 'Across all categories'
    },
    {
      title: 'Avg Response',
      value: `${defaultStats.responseTime}h`,
      icon: Clock,
      color: 'bg-yellow-500',
      change: '-15%',
      description: 'Time to first response'
    },
    {
      title: 'Success Rate',
      value: `${defaultStats.successRate}%`,
      icon: TrendingUp,
      color: 'bg-red-500',
      change: '+2%',
      description: 'Completed successfully'
    },
    {
      title: 'Locations',
      value: defaultStats.locations,
      icon: MapPin,
      color: 'bg-indigo-500',
      change: '+18%',
      description: 'Cities covered'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {statCards.map((stat, index) => {
        const Icon = stat.icon;
        const isPositive = !stat.change.startsWith('-');
        
        return (
          <div key={index} className="card p-4 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className={`${stat.color} p-2 rounded-lg`}>
                <Icon className="h-5 w-5 text-white" />
              </div>
              <div className={`text-sm font-medium px-2 py-1 rounded-full ${
                isPositive
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              }`}>
                {stat.change}
              </div>
            </div>
            
            <div className="mb-1">
              <div className="text-2xl font-bold text-gray-900">
                {stat.value}
              </div>
              <h3 className="text-sm font-semibold text-gray-700">
                {stat.title}
              </h3>
            </div>
            
            <p className="text-xs text-gray-500 mt-2">
              {stat.description}
            </p>
            
            <div className="mt-4 pt-4 border-t">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Today</span>
                <div className="flex items-center gap-1">
                  <TrendingUp className={`h-3 w-3 ${
                    isPositive ? 'text-green-600' : 'text-red-600'
                  }`} />
                  <span className={`font-medium ${
                    isPositive ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {stat.change}
                  </span>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}