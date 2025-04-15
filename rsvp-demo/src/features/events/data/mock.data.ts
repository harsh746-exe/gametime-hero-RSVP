import { Event, EventStats } from '../types/event.types';

/**
 * Interface representing a mock user in the system.
 * Used for both the current user and other users in the system.
 */
export interface MockUser {
  id: string;          // Unique identifier for the user
  name: string;        // Full name of the user
  email: string;       // User's email address
  avatar: string;      // URL to user's avatar image
}

/**
 * Interface representing a friend in the event context.
 * Friends can have different RSVP statuses and are displayed separately from other attendees.
 */
export interface MockFriend {
  id: string;                              // Unique identifier for the friend
  name: string;                            // Friend's full name
  status: 'Yes' | 'No' | 'Maybe';         // Current RSVP status
  avatar: string;                          // URL to friend's avatar image
}

/**
 * Interface extending MockFriend to include mutual friends count.
 * Used for attendees who aren't in the user's direct friend list.
 */
export interface MockAttendee extends MockFriend {
  mutualFriends: number;                   // Number of mutual friends with the current user
}

/**
 * Mock data for the currently authenticated user.
 * In a real application, this would come from an authentication service.
 */
export const MOCK_CURRENT_USER: MockUser = {
  id: 'user123',
  name: 'John Doe',
  email: 'john@example.com',
  avatar: 'https://i.pravatar.cc/150?img=57'  // Using pravatar.cc for consistent avatar generation
};

/**
 * Mock event data representing a tech conference.
 * Contains all necessary information about the event including capacity and timing.
 */
export const MOCK_EVENT: Event = {
  id: '1',
  title: 'Summer Tech Conference 2024',
  description: 'Join us for an exciting day of innovation and networking!',
  location: 'Tech Hub, Downtown',
  startTime: new Date('2024-07-15T09:00:00'),
  endTime: new Date('2024-07-15T18:00:00'),
  maxAttendees: 200,                       // Maximum capacity of the event
  createdBy: 'admin',
  createdAt: new Date(),
  updatedAt: new Date(),
  status: 'upcoming',
  category: 'social',
  imageUrl: 'https://example.com/event-image.jpg'
};

/**
 * Mock data for friends who might attend the event.
 * Each friend has their own RSVP status and avatar.
 * Using pravatar.cc for consistent avatar generation:
 * - Female avatars: img=41-48
 * - Male avatars: img=51-56
 */
export const MOCK_FRIENDS: MockFriend[] = [
  { id: 'f1', name: 'Sarah Wilson', status: 'Yes', avatar: 'https://i.pravatar.cc/150?img=47' },
  { id: 'f2', name: 'Michael Johnson', status: 'Maybe', avatar: 'https://i.pravatar.cc/150?img=53' },
  { id: 'f3', name: 'Emily Davis', status: 'Yes', avatar: 'https://i.pravatar.cc/150?img=45' },
  { id: 'f4', name: 'Chris Brown', status: 'No', avatar: 'https://i.pravatar.cc/150?img=52' },
  { id: 'f5', name: 'Jessica Lee', status: 'Yes', avatar: 'https://i.pravatar.cc/150?img=41' },
  { id: 'f6', name: 'Thomas Harris', status: 'Yes', avatar: 'https://i.pravatar.cc/150?img=54' },
  { id: 'f7', name: 'Rachel Green', status: 'Maybe', avatar: 'https://i.pravatar.cc/150?img=44' },
  { id: 'f8', name: 'Peter Parker', status: 'Yes', avatar: 'https://i.pravatar.cc/150?img=51' }
];

/**
 * Mock data for other attendees (non-friends) who are going to the event.
 * All attendees here are marked as 'Yes' since they've already confirmed.
 * Each attendee has a count of mutual friends with the current user.
 */
export const MOCK_ATTENDEES: MockAttendee[] = [
  { id: 'a1', name: 'Alexandra Thompson', status: 'Yes', avatar: 'https://i.pravatar.cc/150?img=46', mutualFriends: 3 },
  { id: 'a2', name: 'Lisa Anderson', status: 'Yes', avatar: 'https://i.pravatar.cc/150?img=42', mutualFriends: 1 },
  { id: 'a3', name: 'David Miller', status: 'Yes', avatar: 'https://i.pravatar.cc/150?img=55', mutualFriends: 0 },
  { id: 'a4', name: 'Emma Wilson', status: 'Yes', avatar: 'https://i.pravatar.cc/150?img=43', mutualFriends: 2 },
  { id: 'a5', name: 'James Smith', status: 'Yes', avatar: 'https://i.pravatar.cc/150?img=56', mutualFriends: 4 },
  { id: 'a6', name: 'Sophie Turner', status: 'Yes', avatar: 'https://i.pravatar.cc/150?img=48', mutualFriends: 1 }
];

/**
 * Calculates event statistics based on the current user's RSVP status.
 * This function takes into account:
 * - Friends who are attending (status === 'Yes')
 * - All other attendees (always counted as attending)
 * - The current user's RSVP status
 * 
 * @param currentUserStatus - The current user's RSVP status ('Yes', 'No', or 'Maybe')
 * @returns EventStats object containing all calculated statistics
 */
export const calculateEventStats = (currentUserStatus: 'Yes' | 'No' | 'Maybe' = 'No'): EventStats => {
  // Count friends going (excluding current user if they're in the friends list)
  const friendsGoing = MOCK_FRIENDS.filter(f => f.status === 'Yes').length;
  const attendeesGoing = MOCK_ATTENDEES.length; // All attendees are marked as 'Yes'
  
  // Add current user to the count if they're going
  const currentUserGoing = currentUserStatus === 'Yes' ? 1 : 0;
  const totalGoing = friendsGoing + attendeesGoing + currentUserGoing;

  // Count maybe responses
  const friendsMaybe = MOCK_FRIENDS.filter(f => f.status === 'Maybe').length;
  const currentUserMaybe = currentUserStatus === 'Maybe' ? 1 : 0;
  const totalMaybe = friendsMaybe + currentUserMaybe;

  // Count declined responses
  const friendsDeclined = MOCK_FRIENDS.filter(f => f.status === 'No').length;
  const currentUserDeclined = currentUserStatus === 'No' ? 1 : 0;
  const totalDeclined = friendsDeclined + currentUserDeclined;

  // Default max attendees to 200 if not specified
  const maxAttendees = MOCK_EVENT.maxAttendees ?? 200;

  return {
    totalRsvps: MOCK_FRIENDS.length + MOCK_ATTENDEES.length + 1, // +1 for current user
    confirmed: totalGoing,
    declined: totalDeclined,
    maybe: totalMaybe,
    availableSpots: maxAttendees - totalGoing
  };
};

/**
 * Initial event statistics with the current user's default 'No' status.
 * This serves as the starting point for the event's statistics.
 */
export const MOCK_EVENT_STATS: EventStats = calculateEventStats('No'); 