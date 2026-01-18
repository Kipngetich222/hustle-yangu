// app/components/Calendar.tsx
'use client';

import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';

export default function CommitmentCalendar({ userId }: { userId: string }) {
  const [events, setEvents] = useState([]);
  
  useEffect(() => {
    fetchEvents();
  }, [userId]);
  
  const fetchEvents = async () => {
    const response = await fetch(`/api/calendar/${userId}`);
    const data = await response.json();
    setEvents(data.map((event: any) => ({
      id: event.id,
      title: event.title,
      start: event.startTime,
      end: event.endTime,
      backgroundColor: event.status === 'SCHEDULED' ? '#3B82F6' : 
                      event.status === 'IN_PROGRESS' ? '#F59E0B' : '#10B981'
    })));
  };
  
  return (
    <FullCalendar
      plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
      initialView="timeGridWeek"
      events={events}
      height="auto"
      editable={true}
      selectable={true}
      eventClick={(info) => handleEventClick(info.event)}
    />
  );
}