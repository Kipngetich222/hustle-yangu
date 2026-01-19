// components/sidebar.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Home, 
  Briefcase, 
  Calendar, 
  MessageSquare, 
  Users, 
  User, 
  Settings, 
  Bell, 
  TrendingUp, 
  Award,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/', label: 'Dashboard', icon: Home },
  { href: '/jobs', label: 'Jobs', icon: Briefcase },
  { href: '/calendar', label: 'Calendar', icon: Calendar },
  { href: '/messages', label: 'Messages', icon: MessageSquare },
  { href: '/posts', label: 'Community', icon: Users },
  { href: '/portfolio', label: 'Portfolio', icon: Award },
  { href: '/profile', label: 'Profile', icon: User },
  { href: '/settings', label: 'Settings', icon: Settings },
];

const stats = [
  { label: 'Applications', value: '24', change: '+12%', color: 'text-blue-600' },
  { label: 'Jobs Done', value: '156', change: '+8%', color: 'text-green-600' },
  { label: 'Rating', value: '4.8', change: '+0.2', color: 'text-yellow-600' },
  { label: 'Earnings', value: '$2,450', change: '+15%', color: 'text-purple-600' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <aside className={cn(
      'h-screen sticky top-0 bg-white border-r transition-all duration-300',
      isCollapsed ? 'w-20' : 'w-64'
    )}>
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg" />
              <span className="text-xl font-bold">HustleHub</span>
            </Link>
          )}
          {isCollapsed && (
            <Link href="/" className="flex items-center justify-center">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg" />
            </Link>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      {!isCollapsed && (
        <div className="p-4 border-b">
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-gray-600 mb-2">Quick Stats</h3>
            <div className="space-y-3">
              {stats.map((stat, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">{stat.label}</span>
                  <div className="text-right">
                    <div className={cn('font-semibold', stat.color)}>{stat.value}</div>
                    <div className="text-xs text-green-600">{stat.change}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="flex gap-2">
            <button className="flex-1 btn-primary text-sm py-2">
              Find Jobs
            </button>
            <button className="flex-1 btn-secondary text-sm py-2">
              Post Job
            </button>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="p-4">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || 
              (item.href !== '/' && pathname.startsWith(item.href));

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors',
                    isActive
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-600 hover:bg-gray-100'
                  )}
                  title={isCollapsed ? item.label : undefined}
                >
                  <Icon className="h-5 w-5 flex-shrink-0" />
                  {!isCollapsed && (
                    <span className="font-medium">{item.label}</span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Notifications */}
      {!isCollapsed && (
        <div className="p-4 border-t">
          <h3 className="text-sm font-semibold text-gray-600 mb-3">Recent Activity</h3>
          <div className="space-y-3">
            <div className="flex items-start gap-2">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Bell className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium">New job match!</p>
                <p className="text-xs text-gray-600">Delivery driver needed</p>
              </div>
            </div>
                      <div className="flex items-start gap-2">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
              <TrendingUp className="h-4 w-4 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium">Profile viewed</p>
              <p className="text-xs text-gray-600">By 5 employers today</p>
            </div>
          </div>
        </div>
      </div>
    )}
  </aside>
);
}