export interface CalendarEvent {
  id: string;
  summary: string;
  start: string;
  end: string;
}

export interface CreateEventInput {
  summary: string;
  description?: string;
  start: Date;
  end: Date;
  location?: string;
}

const GOOGLE_CALENDAR_API = 'https://www.googleapis.com/calendar/v3';

export async function fetchUpcomingEvents(
  accessToken: string,
  maxResults: number = 5,
): Promise<CalendarEvent[]> {
  const now = new Date().toISOString();

  const url =
    `${GOOGLE_CALENDAR_API}/calendars/primary/events` +
    `?timeMin=${encodeURIComponent(now)}` +
    `&singleEvents=true&orderBy=startTime&maxResults=${maxResults}`;

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Calendar API error (${res.status}): ${text}`);
  }

  const json = await res.json();
  const items = json.items || [];

  return items.map((item: any) => ({
    id: item.id,
    summary: item.summary || '(No title)',
    start: item.start?.dateTime || item.start?.date || '',
    end: item.end?.dateTime || item.end?.date || '',
  }));
}

export async function createCalendarEvent(
  accessToken: string,
  event: CreateEventInput,
): Promise<CalendarEvent> {
  const url = `${GOOGLE_CALENDAR_API}/calendars/primary/events`;

  const eventData = {
    summary: event.summary,
    description: event.description || '',
    start: {
      dateTime: event.start.toISOString(),
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    },
    end: {
      dateTime: event.end.toISOString(),
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    },
    ...(event.location && { location: event.location }),
  };

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(eventData),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed to create event (${res.status}): ${text}`);
  }

  const json = await res.json();

  return {
    id: json.id,
    summary: json.summary || '(No title)',
    start: json.start?.dateTime || json.start?.date || '',
    end: json.end?.dateTime || json.end?.date || '',
  };
}
