// app/settings/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { 
  User, Mail, Bell, MapPin, Lock, Shield, Globe, 
  CreditCard, Download, Moon, Sun 
} from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile');
  const [darkMode, setDarkMode] = useState(false);
  const [locationEnabled, setLocationEnabled] = useState(true);
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    jobAlerts: true,
    messages: true,
    promotions: false
  });

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'privacy', label: 'Privacy', icon: Shield },
    { id: 'billing', label: 'Billing', icon: CreditCard },
    { id: 'appearance', label: 'Appearance', icon: Moon }
  ];

  const handleSave = () => {
    // In a real app, save to API
    alert('Settings saved successfully!');
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600">Manage your account preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="card p-4">
            <nav className="space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      activeTab === tab.id
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="font-medium">{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          <div className="card p-6">
            {/* Profile Settings */}
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold">Profile Settings</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      defaultValue="John Doe"
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Email Address
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="email"
                        defaultValue="john@example.com"
                        className="input-field flex-1"
                      />
                      <Button variant="outline">Verify</Button>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Bio
                  </label>
                  <textarea
                    rows={4}
                    defaultValue="Experienced hustler with 5+ years in various gig economy jobs. Specializing in delivery, cleaning, and handyman services."
                    className="input-field"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      defaultValue="+1 (555) 123-4567"
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Preferred Language
                    </label>
                    <select className="input-field">
                      <option>English</option>
                      <option>Spanish</option>
                      <option>French</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Notification Settings */}
            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold">Notification Preferences</h2>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-medium">Email Notifications</h3>
                      <p className="text-sm text-gray-600">Receive updates via email</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={notifications.email}
                      onChange={(e) => setNotifications({...notifications, email: e.target.checked})}
                      className="toggle"
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-medium">Push Notifications</h3>
                      <p className="text-sm text-gray-600">Receive browser notifications</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={notifications.push}
                      onChange={(e) => setNotifications({...notifications, push: e.target.checked})}
                      className="toggle"
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-medium">Job Alerts</h3>
                      <p className="text-sm text-gray-600">Get notified about new job matches</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={notifications.jobAlerts}
                      onChange={(e) => setNotifications({...notifications, jobAlerts: e.target.checked})}
                      className="toggle"
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-medium">Message Notifications</h3>
                      <p className="text-sm text-gray-600">Get notified about new messages</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={notifications.messages}
                      onChange={(e) => setNotifications({...notifications, messages: e.target.checked})}
                      className="toggle"
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-medium">Promotional Emails</h3>
                      <p className="text-sm text-gray-600">Receive offers and promotions</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={notifications.promotions}
                      onChange={(e) => setNotifications({...notifications, promotions: e.target.checked})}
                      className="toggle"
                    />
                  </div>
                </div>

                <div className="p-4 bg-blue-50 rounded-lg">
                  <h3 className="font-medium mb-2">Location-Based Job Matching</h3>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-600">
                      {locationEnabled 
                        ? 'You will receive job recommendations based on your location'
                        : 'You will receive random job posts from across areas'}
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">
                        {locationEnabled ? 'ON' : 'OFF'}
                      </span>
                      <button
                        onClick={() => setLocationEnabled(!locationEnabled)}
                        className={`w-12 h-6 rounded-full transition-colors ${
                          locationEnabled ? 'bg-blue-600' : 'bg-gray-300'
                        }`}
                      >
                        <div className={`w-5 h-5 bg-white rounded-full transform transition-transform ${
                          locationEnabled ? 'translate-x-7' : 'translate-x-1'
                        }`} />
                      </button>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    When location is off, you'll receive random job posts from across areas instead of localized recommendations
                  </p>
                </div>
              </div>
            )}

            {/* Privacy Settings */}
            {activeTab === 'privacy' && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold">Privacy & Security</h2>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-medium">Profile Visibility</h3>
                      <p className="text-sm text-gray-600">Who can see your profile</p>
                    </div>
                    <select className="input-field w-40">
                      <option>Public</option>
                      <option>Registered Users</option>
                      <option>Private</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-medium">Show Online Status</h3>
                      <p className="text-sm text-gray-600">Let others see when you're online</p>
                    </div>
                    <input type="checkbox" defaultChecked className="toggle" />
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-medium">Allow Messages</h3>
                      <p className="text-sm text-gray-600">Who can send you messages</p>
                    </div>
                    <select className="input-field w-40">
                      <option>Everyone</option>
                      <option>Job Connections</option>
                      <option>No One</option>
                    </select>
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h3 className="font-bold mb-4">Data & Privacy</h3>
                  <div className="space-y-3">
                    <button className="w-full flex justify-between items-center p-3 border rounded-lg hover:bg-gray-50">
                      <span>Download Your Data</span>
                      <Download className="h-5 w-5 text-gray-400" />
                    </button>
                    <button className="w-full flex justify-between items-center p-3 border rounded-lg hover:bg-gray-50">
                      <span>Delete Account</span>
                      <span className="text-red-600 font-medium">Delete</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Billing Settings */}
            {activeTab === 'billing' && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold">Billing & Payments</h2>
                
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-medium mb-4">Payment Methods</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-6 bg-blue-600 rounded"></div>
                          <div>
                            <p className="font-medium">Visa ending in 4242</p>
                            <p className="text-sm text-gray-600">Expires 12/25</p>
                          </div>
                        </div>
                        <span className="text-green-600 text-sm font-medium">Default</span>
                      </div>
                      <button className="w-full btn-secondary">
                        Add Payment Method
                      </button>
                    </div>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <h3 className="font-medium mb-4">Billing History</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 border-b">
                        <div>
                          <p className="font-medium">Premium Membership</p>
                          <p className="text-sm text-gray-600">Jan 15, 2024</p>
                        </div>
                        <span className="font-bold">$9.99</span>
                      </div>
                      <div className="flex justify-between items-center p-3 border-b">
                        <div>
                          <p className="font-medium">Job Promotion</p>
                          <p className="text-sm text-gray-600">Jan 10, 2024</p>
                        </div>
                        <span className="font-bold">$4.99</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Appearance Settings */}
            {activeTab === 'appearance' && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold">Appearance</h2>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      {darkMode ? (
                        <Moon className="h-5 w-5 text-purple-600" />
                      ) : (
                        <Sun className="h-5 w-5 text-yellow-600" />
                      )}
                      <div>
                        <h3 className="font-medium">Dark Mode</h3>
                        <p className="text-sm text-gray-600">Switch between light and dark themes</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setDarkMode(!darkMode)}
                      className={`w-12 h-6 rounded-full transition-colors ${
                        darkMode ? 'bg-purple-600' : 'bg-gray-300'
                      }`}
                    >
                      <div className={`w-5 h-5 bg-white rounded-full transform transition-transform ${
                        darkMode ? 'translate-x-7' : 'translate-x-1'
                      }`} />
                    </button>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <h3 className="font-medium mb-4">Theme Color</h3>
                    <div className="flex gap-3">
                      {['blue', 'green', 'purple', 'orange'].map((color) => (
                        <button
                          key={color}
                          className={`w-10 h-10 rounded-full bg-${color}-500`}
                          title={`${color} theme`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Save Button */}
            <div className="flex justify-end gap-3 pt-6 border-t">
              <Button variant="outline">
                Cancel
              </Button>
              <Button onClick={handleSave}>
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}