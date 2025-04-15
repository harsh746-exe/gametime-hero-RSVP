import { Event, EventStats } from '../types/event.types';
import { RsvpStatus } from '../types/rsvp.types';

/**
 * Calculates the current status of an event based on its start and end times
 */
export function calculateEventStatus(event: Event): Event['status'] {
  const now = new Date();
  const startTime = new Date(event.startTime);
  const endTime = new Date(event.endTime);

  if (now < startTime) return 'upcoming';
  if (now >= startTime && now <= endTime) return 'ongoing';
  if (now > endTime) return 'completed';
  return 'upcoming';
}

/**
 * Formats event statistics into a human-readable string
 */
export function formatEventStats(stats: EventStats): string {
  const { totalRsvps, confirmed, declined, maybe, availableSpots } = stats;
  return `Total RSVPs: ${totalRsvps} (${confirmed} confirmed, ${declined} declined, ${maybe} maybe)${
    availableSpots !== undefined ? `, ${availableSpots} spots available` : ''
  }`;
}

/**
 * Validates if an event can be created or updated
 */
export function validateEvent(event: Partial<Event>): string[] {
  const errors: string[] = [];

  if (event.title && event.title.length < 3) {
    errors.push('Title must be at least 3 characters long');
  }

  if (event.startTime && event.endTime) {
    const start = new Date(event.startTime);
    const end = new Date(event.endTime);
    if (start >= end) {
      errors.push('End time must be after start time');
    }
  }

  if (event.maxAttendees !== undefined && event.maxAttendees < 1) {
    errors.push('Maximum attendees must be at least 1');
  }

  return errors;
}

/**
 * Checks if a user can modify an event
 */
export function canModifyEvent(event: Event, userId: string): boolean {
  return event.createdBy === userId;
}

/**
 * Gets the appropriate RSVP status based on user action
 */
export function getRsvpStatus(action: 'accept' | 'decline' | 'maybe'): RsvpStatus {
  switch (action) {
    case 'accept':
      return 'Yes';
    case 'decline':
      return 'No';
    case 'maybe':
      return 'Maybe';
    default:
      return 'No';
  }
} 