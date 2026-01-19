// components/calendarview.tsx
'use client';

import { useState, useEffect } from 'react';
import { Calendar, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { format, isToday, isTomorrow, isPast, isFuture } from 'date-fns';

interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
  status: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  job?: {
    title: string;
    employer?: {
      name: string;
    };
  };
}

interface CalendarViewProps {
  events?: CalendarEvent[];
  view?: 'day' | 'week' | 'month';
}

export default function CalendarView({ events = [], view = 'week' }: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Sample events if none provided
  const sampleEvents: CalendarEvent[] = [
    {
      id: '1',
      title: 'House Cleaning',
      description: 'Residential cleaning in downtown',
      startTime: new Date().toISOString(),
      endTime: new Date(Date.now() + 3 * 60 * 60 * 1000).toISOString(),
      status: 'SCHEDULED',
      job: {
        title: 'House Cleaning',
        employer: { name: 'Jane Smith' }
      }
    },
    {
      id: '2',
      title: 'Delivery Run',
      description: 'Food delivery for local restaurant',
      startTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      endTime: new Date(Date.now() + 26 * 60 * 60 * 1000).toISOString(),
      status: 'SCHEDULED',
      job: {
        title: 'Delivery Driver',
        employer: { name: 'Pizza Palace' }
      }
    },
    {
      id: '3',
      title: 'Garden Maintenance',
      description: 'Weekly garden upkeep',
      startTime: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(),
      endTime: new Date(Date.now() + 50 * 60 * 60 * 1000).toISOString(),
      status: 'IN_PROGRESS',
      job: {
        title: 'Gardener',
        employer: { name: 'John Doe' }
      }
    }
  ];

  const displayEvents = events.length > 0 ? events : sampleEvents;

  const filteredEvents = filterStatus === 'all' 
    ? displayEvents 
    : displayEvents.filter(event => event.status === filterStatus);

  const getStatusIcon = (status: CalendarEvent['status']) => {
    switch (status) {
      case 'SCHEDULED':
        return <Clock className="h-4 w-4 text-blue-600" />;
      case 'IN_PROGRESS':
        return <AlertCircle className="h-4 w-4 text-yellow-600" />;
      case 'COMPLETED':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'CANCELLED':
        return <XCircle className="h-4 w-4 text-red-600" />;
    }
  };

  const getStatusColor = (status: CalendarEvent['status']) => {
    switch (status) {
      case 'SCHEDULED':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'IN_PROGRESS':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'COMPLETED':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800 border-red-200';
    }
  };

  const getRelativeDate = (date: Date) => {
    if (isToday(date)) return 'Today';
    if (isTomorrow(date)) return 'Tomorrow';
    return format(date, 'EEEE');
  };

  const groupedEvents = filteredEvents.reduce((groups, event) => {
    const date = format(new Date(event.startTime), 'yyyy-MM-dd');
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(event);
    return groups;
  }, {} as Record<string, CalendarEvent[]>);

  const upcomingDates = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i);
    return date;
  });

  return (
    <div className="space-y-6">
      {/* Calendar Controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h3 className="text-lg font-semibold">Your Schedule</h3>
          <p className="text-sm text-gray-600">
            {format(currentDate, 'MMMM yyyy')}
          </p>
        </div>
        
        <div className="flex gap-2">
          {(['all', 'SCHEDULED', 'IN_PROGRESS', 'COMPLETED'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                filterStatus === status
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {status === 'all' ? 'All' : status.toLowerCase().replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Upcoming Days */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-7 gap-2">
        {upcomingDates.map((date) => (
          <div
            key={date.toISOString()}
            className={`p-3 rounded-lg border text-center transition-colors ${
              isToday(date)
                ? 'bg-blue-50 border-blue-200'
                : 'border-gray-200 hover:bg-gray-50'
            }`}
          >
            <div className="text-sm text-gray-600">
              {getRelativeDate(date)}
            </div>
            <div className="text-xl font-bold mt-1">
              {format(date, 'd')}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {format(date, 'MMM')}
            </div>
          </div>
        ))}
      </div>

      {/* Events List */}
      <div className="space-y-4">
        {Object.entries(groupedEvents).length > 0 ? (
          Object.entries(groupedEvents).map(([date, events]) => (
            <div key={date}>
              <h4 className="text-sm font-semibold text-gray-700 mb-2">
                {getRelativeDate(new Date(date))} • {format(new Date(date), 'MMMM d')}
              </h4>
              <div className="space-y-3">
                {events.map((event) => (
                  <div
                    key={event.id}
                    className={`p-4 rounded-lg border ${getStatusColor(event.status)}`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(event.status)}
                        <h5 className="font-semibold">{event.title}</h5>
                      </div>
                      <span className="text-sm font-medium capitalize">
                        {event.status.toLowerCase().replace('_', ' ')}
                      </span>
                    </div>
                    
                    {event.description && (
                      <p className="text-sm mb-3">{event.description}</p>
                    )}
                    
                    <div className="flex justify-between items-center text-sm">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>
                            {format(new Date(event.startTime), 'h:mm a')} -{' '}
                            {format(new Date(event.endTime), 'h:mm a')}
                          </span>
                        </div>
                        {event.job?.employer && (
                          <div className="text-gray-600">
                            with {event.job.employer.name}
                          </div>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <button className="text-sm text-blue-600 hover:text-blue-800">
                          Details
                        </button>
                        {event.status === 'SCHEDULED' && (
                          <button className="text-sm text-red-600 hover:text-red-800">
                            Cancel
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h4 className="text-lg font-semibold text-gray-900 mb-2">
              No events scheduled
            </h4>
            <p className="text-gray-600">
              {filterStatus === 'all' 
                ? 'You have no upcoming commitments'
                : `No ${filterStatus.toLowerCase()} events`}
            </p>
          </div>
        )}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">
            {displayEvents.filter(e => e.status === 'SCHEDULED').length}
          </div>
          <div className="text-sm text-gray-600">Upcoming</div>
        </div>
        <div className="card p-4 text-center">
          <div className="text-2xl font-bold text-yellow-600">
            {displayEvents.filter(e => e.status === 'IN_PROGRESS').length}
          </div>
          <div className="text-sm text-gray-600">In Progress</div>
        </div>
        <div className="card p-4 text-center">
          <div className="text-2xl font-bold text-green-600">
            {displayEvents.filter(e => e.status === 'COMPLETED').length}
          </div>
          <div className="text-sm text-gray-600">Completed</div>
        </div>
        <div className="card p-4 text-center">
          <div className="text-2xl font-bold text-purple-600">
            {displayEvents.length}
          </div>
          <div className="text-sm text-gray-600">Total</div>
        </div>
      </div>
    </div>
  );
}