'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Bell, MessageSquare, Calendar, MapPin, User, Search } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/Button'
import NotificationDropdown from '@/components/NotificationDropdown'

export default function Navbar() {
  const pathname = usePathname()
  const { user, signOut } = useAuth()
  const [searchQuery, setSearchQuery] = useState('')

  const navLinks = [
    { href: '/jobs', label: 'Jobs', icon: MapPin },
    { href: '/calendar', label: 'Calendar', icon: Calendar },
    { href: '/messages', label: 'Messages', icon: MessageSquare },
    { href: '/posts', label: 'Community', icon: MessageSquare },
  ]

  return (
    <nav className="sticky top-0 z-50 bg-white border-b shadow-sm">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg" />
            <span className="text-xl font-bold text-gray-900">HustleHub</span>
          </Link>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-2xl mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search jobs, skills, or locations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center space-x-4">
            {navLinks.map((link) => {
              const Icon = link.icon
              const isActive = pathname.startsWith(link.href)
              
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`hidden md:flex items-center space-x-1 px-3 py-2 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{link.label}</span>
                </Link>
              )
            })}

            {/* Notifications */}
            <NotificationDropdown />

            {/* User Profile */}
            <div className="relative group">
              <button className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100">
                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                  <User className="h-5 w-5 text-gray-600" />
                </div>
                <span className="hidden md:inline font-medium">
                  {user?.name || 'Guest'}
                </span>
              </button>
              
              {/* Dropdown Menu */}
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border hidden group-hover:block">
                <Link
                  href="/profile"
                  className="block px-4 py-3 hover:bg-gray-50"
                >
                  Your Profile
                </Link>
                <Link
                  href="/portfolio"
                  className="block px-4 py-3 hover:bg-gray-50"
                >
                  Portfolio
                </Link>
                <Link
                  href="/settings"
                  className="block px-4 py-3 hover:bg-gray-50"
                >
                  Settings
                </Link>
                <div className="border-t">
                  <button
                    onClick={() => signOut()}
                    className="w-full text-left px-4 py-3 text-red-600 hover:bg-gray-50"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button className="md:hidden p-2 rounded-lg hover:bg-gray-100">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}