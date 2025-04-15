/**
 * Represents the possible RSVP statuses for an event
 */
export type RsvpStatus = 'Yes' | 'No' | 'Maybe';

/**
 * Interface for RSVP-related errors
 */
export interface RsvpError {
  code: 'MAX_ATTENDEES_REACHED' | 'EVENT_NOT_FOUND' | 'USER_NOT_FOUND' | 'INVALID_STATUS';
  message: string;
}

/**
 * Interface for RSVP update response
 */
export interface RsvpUpdateResponse {
  success: boolean;
  error?: RsvpError;
  rsvpStatus?: RsvpStatus;
} 