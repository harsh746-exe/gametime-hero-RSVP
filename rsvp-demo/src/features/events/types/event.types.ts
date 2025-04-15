import { RsvpStatus } from './rsvp.types';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  bio?: string;
  createdAt: Date;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  location: string;
  startTime: Date;
  endTime: Date;
  maxAttendees: number;
  createdBy: string; // User ID
  createdAt: Date;
  updatedAt: Date;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  category: 'sports' | 'gaming' | 'social' | 'other';
  imageUrl?: string;
  price?: number;
  requirements?: string[];
}

export interface EventRsvp {
  eventId: string;
  userId: string;
  name?: string;
  status: RsvpStatus;
  createdAt: Date;
  updatedAt: Date;
  notes?: string;
}

export interface EventStats {
  totalRsvps: number;
  confirmed: number;
  declined: number;
  maybe: number;
  availableSpots?: number;
}

export interface UserEvent {
  event: Event;
  rsvpStatus: RsvpStatus;
  isOrganizer: boolean;
} 