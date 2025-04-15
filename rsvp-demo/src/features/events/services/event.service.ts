import { Event, EventRsvp, EventStats, UserEvent } from '../types/event.types';
import { RsvpStatus, RsvpError, RsvpUpdateResponse } from '../types/rsvp.types';
import { AuthService } from '../../auth/services/auth.service';
import { Logger } from '../../auth/services/logger.service';
import { calculateEventStatus, validateEvent, canModifyEvent, getRsvpStatus } from '../utils/event.utils';

/**
 * Service for managing events and RSVPs
 */
export class EventService {
  private events: Event[] = [];
  private rsvps: EventRsvp[] = [];
  private authService: AuthService;
  private logger: Logger;

  constructor(authService: AuthService, logger: Logger) {
    this.authService = authService;
    this.logger = logger;
    this.loadDemoData();
  }

  /**
   * Loads demo data for testing purposes
   */
  private loadDemoData(): void {
    this.logger.info('Loading demo data');
    // Create demo events
    this.events = [
      {
        id: '1',
        title: 'Weekly Basketball Game',
        description: 'Join us for our weekly basketball game at the local court.',
        startTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        endTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000),
        location: 'Local Community Center',
        maxAttendees: 20,
        status: 'upcoming',
        category: 'sports',
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: '1',
      },
      {
        id: '2',
        title: 'Soccer Tournament',
        description: 'Annual soccer tournament for all skill levels.',
        startTime: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        endTime: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000 + 6 * 60 * 60 * 1000),
        location: 'City Sports Complex',
        maxAttendees: 100,
        status: 'upcoming',
        category: 'sports',
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: '1',
      },
    ];

    // Create demo RSVPs
    this.rsvps = [
      {
        eventId: '1',
        userId: '1',
        status: 'Yes',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        eventId: '2',
        userId: '1',
        status: 'Maybe',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
  }

  /**
   * Creates a new event
   * @param eventData The event data to create
   * @throws Error if user is not authenticated
   * @returns The created event
   */
  async createEvent(eventData: Omit<Event, 'id' | 'createdAt' | 'updatedAt' | 'createdBy'>): Promise<Event> {
    this.logger.debug('Creating new event', eventData);
    const user = this.authService.getCurrentUser();
    if (!user) {
      this.logger.error('User not authenticated for event creation');
      throw new Error('User must be authenticated to create events');
    }

    const validationErrors = validateEvent(eventData);
    if (validationErrors.length > 0) {
      this.logger.error('Event validation failed', validationErrors);
      throw new Error(`Invalid event data: ${validationErrors.join(', ')}`);
    }

    const newEvent: Event = {
      ...eventData,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: user.id,
      status: calculateEventStatus(eventData as Event),
    };

    this.events.push(newEvent);
    this.logger.info('Event created successfully', { eventId: newEvent.id });
    return newEvent;
  }

  /**
   * Gets all events
   * @returns Array of all events
   */
  async getEvents(): Promise<Event[]> {
    return this.events;
  }

  /**
   * Gets an event by ID
   * @param id The event ID
   * @returns The event or null if not found
   */
  async getEventById(id: string): Promise<Event | null> {
    return this.events.find(event => event.id === id) || null;
  }

  /**
   * Gets events for a specific user
   * @param userId The user ID
   * @returns Array of user events with RSVP status
   */
  async getUserEvents(userId: string): Promise<UserEvent[]> {
    return this.events.map(event => ({
      event,
      rsvpStatus: this.rsvps.find(rsvp => rsvp.eventId === event.id && rsvp.userId === userId)?.status || 'No',
      isOrganizer: event.createdBy === userId,
    }));
  }

  /**
   * Gets statistics for an event
   * @param eventId The event ID
   * @returns Event statistics
   */
  async getEventStats(eventId: string): Promise<EventStats> {
    const eventRsvps = this.rsvps.filter(rsvp => rsvp.eventId === eventId);
    const event = this.events.find(e => e.id === eventId);
    
    return {
      totalRsvps: eventRsvps.length,
      confirmed: eventRsvps.filter(rsvp => rsvp.status === 'Yes').length,
      declined: eventRsvps.filter(rsvp => rsvp.status === 'No').length,
      maybe: eventRsvps.filter(rsvp => rsvp.status === 'Maybe').length,
      availableSpots: event?.maxAttendees ? event.maxAttendees - eventRsvps.filter(rsvp => rsvp.status === 'Yes').length : undefined,
    };
  }

  /**
   * Updates an event
   * @param id The event ID
   * @param eventData The event data to update
   * @throws Error if user is not authorized
   * @returns The updated event or null if not found
   */
  async updateEvent(id: string, eventData: Partial<Event>): Promise<Event | null> {
    const index = this.events.findIndex(event => event.id === id);
    if (index === -1) return null;

    const user = this.authService.getCurrentUser();
    if (!user || !canModifyEvent(this.events[index], user.id)) {
      throw new Error('Unauthorized to update this event');
    }

    const validationErrors = validateEvent(eventData);
    if (validationErrors.length > 0) {
      throw new Error(`Invalid event data: ${validationErrors.join(', ')}`);
    }

    this.events[index] = {
      ...this.events[index],
      ...eventData,
      updatedAt: new Date(),
      status: calculateEventStatus({ ...this.events[index], ...eventData } as Event),
    };

    return this.events[index];
  }

  /**
   * Deletes an event
   * @param id The event ID
   * @throws Error if user is not authorized
   * @returns True if deleted, false if not found
   */
  async deleteEvent(id: string): Promise<boolean> {
    const index = this.events.findIndex(event => event.id === id);
    if (index === -1) return false;

    const user = this.authService.getCurrentUser();
    if (!user || !canModifyEvent(this.events[index], user.id)) {
      throw new Error('Unauthorized to delete this event');
    }

    this.events.splice(index, 1);
    return true;
  }

  /**
   * Updates a user's RSVP status for an event
   * @param eventId The event ID
   * @param status The new RSVP status
   * @returns The update response
   */
  async updateRsvp(eventId: string, status: RsvpStatus): Promise<RsvpUpdateResponse> {
    this.logger.debug('Updating RSVP', { eventId, status });
    const user = this.authService.getCurrentUser();
    if (!user) {
      this.logger.error('User not authenticated for RSVP update');
      return {
        success: false,
        error: {
          code: 'USER_NOT_FOUND',
          message: 'User must be authenticated to update RSVP',
        },
      };
    }

    const event = this.events.find(e => e.id === eventId);
    if (!event) {
      this.logger.error('Event not found for RSVP update', { eventId });
      return {
        success: false,
        error: {
          code: 'EVENT_NOT_FOUND',
          message: 'Event not found',
        },
      };
    }

    if (status === 'Yes' && event.maxAttendees) {
      const confirmedCount = this.rsvps.filter(
        r => r.eventId === eventId && r.status === 'Yes'
      ).length;
      if (confirmedCount >= event.maxAttendees) {
        this.logger.error('Event is full', { eventId, confirmedCount, maxAttendees: event.maxAttendees });
        return {
          success: false,
          error: {
            code: 'MAX_ATTENDEES_REACHED',
            message: 'Event is full',
          },
        };
      }
    }

    const existingRsvpIndex = this.rsvps.findIndex(
      r => r.eventId === eventId && r.userId === user.id
    );

    if (existingRsvpIndex >= 0) {
      this.rsvps[existingRsvpIndex] = {
        ...this.rsvps[existingRsvpIndex],
        status,
        updatedAt: new Date(),
      };
      this.logger.info('RSVP updated', { eventId, userId: user.id, status });
    } else {
      this.rsvps.push({
        eventId,
        userId: user.id,
        status,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      this.logger.info('New RSVP created', { eventId, userId: user.id, status });
    }

    return {
      success: true,
      rsvpStatus: status,
    };
  }
} 