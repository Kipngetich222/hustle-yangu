// app/notifications/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { Bell, Check, X, Clock, AlertCircle, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'APPLICATION' | 'MESSAGE' | 'JOB_UPDATE' | 'SYSTEM';
  link?: string;
  isRead: boolean;
  createdAt: string;
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      title: 'New Job Match',
      message: 'Your skills match a new cleaning job in your area',
      type: 'JOB_UPDATE',
      isRead: false,
      createdAt: '2024-01-15T10:30:00Z'
    },
    {
      id: '2',
      title: 'Application Accepted',
      message: 'Your application for "Delivery Driver" has been accepted',
      type: 'APPLICATION',
      isRead: true,
      createdAt: '2024-01-14T15:45:00Z'
    },
    {
      id: '3',
      title: 'New Message',
      message: 'John Smith sent you a message about your job posting',
      type: 'MESSAGE',
      isRead: false,
      createdAt: '2024-01-14T09:20:00Z'
    },
    {
      id: '4',
      title: 'System Update',
      message: 'New features added: Location-based job matching and portfolio upload',
      type: 'SYSTEM',
      isRead: true,
      createdAt: '2024-01-13T14:10:00Z'
    }
  ]);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const filteredNotifications = filter === 'all' 
    ? notifications 
    : notifications.filter(n => !n.isRead);

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n =>
        n.id === id ? { ...n, isRead: true } : n
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(n => ({ ...n, isRead: true }))
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'APPLICATION':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'MESSAGE':
        return <Bell className="h-5 w-5 text-blue-600" />;
      case 'JOB_UPDATE':
        return <AlertCircle className="h-5 w-5 text-yellow-600" />;
      case 'SYSTEM':
        return <CheckCircle className="h-5 w-5 text-purple-600" />;
      default:
        return <Bell className="h-5 w-5 text-gray-600" />;
    }
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
          <p className="text-gray-600">Stay updated with your job activities</p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={() => setFilter(filter === 'all' ? 'unread' : 'all')}
          >
            {filter === 'all' ? 'Show Unread' : 'Show All'}
          </Button>
          <Button
            variant="outline"
            onClick={markAllAsRead}
          >
            Mark All as Read
          </Button>
        </div>
      </div>

      <div className="card p-6">
        {filteredNotifications.length === 0 ? (
          <div className="text-center py-12">
            <Bell className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No notifications
            </h3>
            <p className="text-gray-600">
              {filter === 'unread' 
                ? 'You have no unread notifications'
                : 'You have no notifications yet'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 rounded-lg border transition-colors ${
                  notification.isRead
                    ? 'bg-white border-gray-200'
                    : 'bg-blue-50 border-blue-200'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="mt-1">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold text-gray-900">
                        {notification.title}
                      </h4>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500">
                          {getTimeAgo(notification.createdAt)}
                        </span>
                        <button
                          onClick={() => markAsRead(notification.id)}
                          className="p-1 hover:bg-gray-100 rounded"
                          title="Mark as read"
                        >
                          <Check className="h-4 w-4 text-gray-500" />
                        </button>
                        <button
                          onClick={() => deleteNotification(notification.id)}
                          className="p-1 hover:bg-gray-100 rounded"
                          title="Delete"
                        >
                          <X className="h-4 w-4 text-gray-500" />
                        </button>
                      </div>
                    </div>
                    <p className="text-gray-700 mb-3">
                      {notification.message}
                    </p>
                    {notification.link && (
                      <a
                        href={notification.link}
                        className="text-blue-600 hover:underline text-sm font-medium"
                      >
                        View Details →
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card p-6">
          <h3 className="text-lg font-semibold mb-4">Notification Settings</h3>
          <div className="space-y-3">
            <label className="flex items-center justify-between">
              <span className="text-gray-700">Job Alerts</span>
              <input type="checkbox" defaultChecked className="toggle" />
            </label>
            <label className="flex items-center justify-between">
              <span className="text-gray-700">Application Updates</span>
              <input type="checkbox" defaultChecked className="toggle" />
            </label>
            <label className="flex items-center justify-between">
              <span className="text-gray-700">Messages</span>
              <input type="checkbox" defaultChecked className="toggle" />
            </label>
            <label className="flex items-center justify-between">
              <span className="text-gray-700">Promotional</span>
              <input type="checkbox" className="toggle" />
            </label>
          </div>
        </div>

        <div className="card p-6 md:col-span-2">
          <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 border rounded-lg">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Briefcase className="h-5 w-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="font-medium">Applied for Delivery Driver position</p>
                <p className="text-sm text-gray-600">2 days ago</p>
              </div>
              <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                Pending
              </span>
            </div>
            <div className="flex items-center gap-3 p-3 border rounded-lg">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <div className="flex-1">
                <p className="font-medium">Completed House Cleaning job</p>
                <p className="text-sm text-gray-600">3 days ago</p>
              </div>
              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                Paid
              </span>
            </div>
            <div className="flex items-center gap-3 p-3 border rounded-lg">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <User className="h-5 w-5 text-purple-600" />
              </div>
              <div className="flex-1">
                <p className="font-medium">Profile viewed by 5 employers</p>
                <p className="text-sm text-gray-600">1 week ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}