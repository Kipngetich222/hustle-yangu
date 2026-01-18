'use client'

import { useState, useEffect } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import { Calendar, Plus, Filter } from 'lucide-react'
import { getCalendarEvents, createCalendarEvent } from '@/actions/calendar'
import { Button } from '@/components/ui/Button'

export default function CalendarPage() {
  const [events, setEvents] = useState<any[]>([])
  const [view, setView] = useState('timeGridWeek')
  const [isLoading, setIsLoading] = useState(true)
  const [showEventModal, setShowEventModal] = useState(false)
  const [selectedDate, setSelectedDate] = useState('')

  useEffect(() => {
    loadEvents()
  }, [])

  const loadEvents = async () => {
    try {
      setIsLoading(true)
      const data = await getCalendarEvents()
      const formattedEvents = data.map(event => ({
        id: event.id,
        title: event.title,
        start: event.startTime,
        end: event.endTime,
        backgroundColor: getEventColor(event.status),
        borderColor: getEventColor(event.status),
        extendedProps: {
          description: event.description,
          status: event.status,
          jobId: event.jobId
        }
      }))
      setEvents(formattedEvents)
    } catch (error) {
      console.error('Error loading events:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getEventColor = (status: string) => {
    switch (status) {
      case 'SCHEDULED':
        return '#3B82F6' // blue
      case 'IN_PROGRESS':
        return '#F59E0B' // yellow
      case 'COMPLETED':
        return '#10B981' // green
      case 'CANCELLED':
        return '#EF4444' // red
      default:
        return '#6B7280' // gray
    }
  }

  const handleDateSelect = (selectInfo: any) => {
    setSelectedDate(selectInfo.startStr)
    setShowEventModal(true)
  }

  const handleEventClick = (clickInfo: any) => {
    alert(`Event: ${clickInfo.event.title}`)
  }

  const handleViewChange = (view: string) => {
    setView(view)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Calendar</h1>
          <p className="text-gray-600">Manage your job commitments and schedule</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filter
          </Button>
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Event
          </Button>
        </div>
      </div>

      {/* Calendar Controls */}
      <div className="card p-4">
        <div className="flex flex-wrap gap-2 mb-4">
          {['dayGridMonth', 'timeGridWeek', 'timeGridDay'].map((viewType) => (
            <button
              key={viewType}
              onClick={() => handleViewChange(viewType)}
              className={`px-4 py-2 rounded-lg ${
                view === viewType
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {viewType === 'dayGridMonth' ? 'Month' :
               viewType === 'timeGridWeek' ? 'Week' : 'Day'}
            </button>
          ))}
        </div>

        {/* Calendar */}
        <div className="calendar-container">
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView={view}
            events={events}
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'dayGridMonth,timeGridWeek,timeGridDay'
            }}
            editable={true}
            selectable={true}
            selectMirror={true}
            dayMaxEvents={true}
            weekends={true}
            select={handleDateSelect}
            eventClick={handleEventClick}
            eventContent={renderEventContent}
            height="auto"
          />
        </div>
      </div>

      {/* Legend */}
      <div className="card p-4">
        <h3 className="text-lg font-semibold mb-3">Legend</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            <span className="text-sm">Scheduled</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <span className="text-sm">In Progress</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="text-sm">Completed</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <span className="text-sm">Cancelled</span>
          </div>
        </div>
      </div>

      {/* Upcoming Events */}
      <div className="card p-6">
        <h3 className="text-xl font-bold mb-4">Upcoming Commitments</h3>
        <div className="space-y-3">
          {events
            .filter(event => new Date(event.start) > new Date())
            .slice(0, 5)
            .map(event => (
              <div key={event.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <h4 className="font-semibold">{event.title}</h4>
                  <p className="text-sm text-gray-600">
                    {new Date(event.start).toLocaleString()}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: event.backgroundColor }}
                  ></div>
                  <span className="text-sm capitalize">{event.extendedProps.status.toLowerCase()}</span>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  )
}

function renderEventContent(eventInfo: any) {
  return (
    <div className="p-1">
      <div className="font-semibold text-sm">{eventInfo.event.title}</div>
      <div className="text-xs opacity-75">
        {eventInfo.timeText}
      </div>
    </div>
  )
}