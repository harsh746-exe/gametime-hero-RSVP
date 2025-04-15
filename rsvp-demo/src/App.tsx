import React, { useState, useEffect } from 'react';
import { EventService } from './features/events/services/event.service';
import { AuthService } from './features/auth/services/auth.service';
import { ConsoleLogger } from './features/auth/services/logger.service';
import { EventRsvp, EventStats } from './features/events/types/event.types';
import { RsvpStatus } from './features/events/types/rsvp.types';
import {
  MOCK_EVENT,
  MOCK_FRIENDS,
  MOCK_ATTENDEES,
  MOCK_CURRENT_USER,
  MOCK_EVENT_STATS,
  calculateEventStats
} from './features/events/data/mock.data';
import './App.css';

const authService = new AuthService();
const logger = new ConsoleLogger();
const eventService = new EventService(authService, logger);

/**
 * Modal component for displaying lists of friends or attendees.
 * Provides a reusable overlay with a title and content area.
 * Closes when clicking outside the modal content.
 */
interface ModalProps {
  title: string;                    // Title displayed at the top of the modal
  show: boolean;                    // Controls modal visibility
  onClose: () => void;             // Callback function when modal is closed
  children: React.ReactNode;        // Content to be displayed inside the modal
}

const Modal: React.FC<ModalProps> = ({ title, show, onClose, children }) => {
  if (!show) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{title}</h2>
          <button onClick={onClose}>&times;</button>
        </div>
        <div className="modal-body">
          {children}
        </div>
      </div>
    </div>
  );
};

/**
 * Main application component that manages the event RSVP system.
 * Features include:
 * - RSVP status selection
 * - Friends and attendees display with avatar stacks
 * - Event statistics
 * - Modal views for detailed lists
 */
function App() {
  // State management for user interactions and data
  const [status, setStatus] = useState<RsvpStatus>('No');  // Current user's RSVP status
  const [rsvps, setRsvps] = useState<EventRsvp[]>([]);
  const [eventStats, setEventStats] = useState<EventStats>(MOCK_EVENT_STATS);
  const [loading, setLoading] = useState(false);
  const [showFriendsModal, setShowFriendsModal] = useState(false);     // Controls friends list modal
  const [showAttendeesModal, setShowAttendeesModal] = useState(false); // Controls attendees list modal

  /**
   * Updates event statistics whenever the user's RSVP status changes.
   * Recalculates all counts including:
   * - Total confirmed attendees
   * - Maybe responses
   * - Declined responses
   * - Available spots
   */
  useEffect(() => {
    setEventStats(calculateEventStats(status));
  }, [status]);

  /**
   * Handles the submission of an RSVP response.
   * Updates the user's status and triggers a recalculation of event statistics.
   * @param newStatus - The new RSVP status selected by the user
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const rsvp: EventRsvp = {
        eventId: MOCK_EVENT.id,
        userId: MOCK_CURRENT_USER.id,
        name: MOCK_CURRENT_USER.name,
        status,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      await eventService.updateRsvp(rsvp.eventId, rsvp.status);
      setRsvps([...rsvps, rsvp]);
      
      // Stats will be automatically updated by the useEffect when status changes
      
      // Show success message or notification here
    } catch (error) {
      console.error('Failed to submit RSVP:', error);
      // Show error message or notification here
    } finally {
      setLoading(false);
    }
  };

  /**
   * Formats a date object into a human-readable string.
   * @param date - The date to format
   * @returns A string in the format "Month Day, Year at HH:MM AM/PM"
   */
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  return (
    <div className="App">
      <div className="App-container">
        {/* Left Column - Event Info & RSVP */}
        <div className="left-column">
          <div className="user-welcome">
            <img src={MOCK_CURRENT_USER.avatar} alt={MOCK_CURRENT_USER.name} className="user-avatar" />
            <span>Welcome, {MOCK_CURRENT_USER.name}!</span>
          </div>

          <h1 className="event-title">{MOCK_EVENT.title}</h1>
          <p className="event-subtitle">{MOCK_EVENT.description}</p>
          
          <div className="event-details">
            <div className="detail-item">
              <span className="detail-icon">📍</span>
              <span>{MOCK_EVENT.location}</span>
            </div>
            <div className="detail-item">
              <span className="detail-icon">📅</span>
              <span>{formatDate(MOCK_EVENT.startTime)}</span>
            </div>
            <div className="detail-item">
              <span className="detail-icon">⏰</span>
              <span>{formatDate(MOCK_EVENT.endTime)}</span>
            </div>
          </div>

          <div className="form-container">
            <form onSubmit={handleSubmit}>
              <div className="input-group">
                <label>Your Response</label>
                <select 
                  value={status} 
                  onChange={(e) => setStatus(e.target.value as RsvpStatus)}
                  disabled={loading}
                >
                  <option value="Yes">Yes, I'll be there! 🎉</option>
                  <option value="No">Sorry, can't make it 😢</option>
                  <option value="Maybe">Maybe, will confirm later 🤔</option>
                </select>
              </div>
              <button type="submit" disabled={loading}>
                {loading ? 'Updating...' : 'Update RSVP'}
              </button>
            </form>
          </div>
        </div>

        {/* Right Column - Stats and Lists */}
        <div className="right-column">
          <div className="stats-grid">
            <div className="stat-box">
              <h3>GOING</h3>
              <p>{eventStats.confirmed}</p>
            </div>
            <div className="stat-box">
              <h3>MAYBE</h3>
              <p>{eventStats.maybe}</p>
            </div>
            <div className="stat-box">
              <h3>SPOTS LEFT</h3>
              <p>{eventStats.availableSpots}</p>
            </div>
          </div>

          {/* Friends Section */}
          <div className="section-header">
            <h2 className="section-title">Friends Attending</h2>
            <span className="count-badge">{MOCK_FRIENDS.length}</span>
          </div>
          <div className="avatar-stack">
            {MOCK_FRIENDS.slice(0, 4).map(friend => (
              <div 
                key={friend.id} 
                className="avatar-item"
                onClick={() => setShowFriendsModal(true)}
              >
                <img src={friend.avatar} alt={friend.name} className="avatar-image" />
                <div className={`avatar-status status-${friend.status.toLowerCase()}`} />
              </div>
            ))}
            {MOCK_FRIENDS.length > 4 && (
              <div 
                className="see-all-avatar"
                onClick={() => setShowFriendsModal(true)}
              >
                +{MOCK_FRIENDS.length - 4}
              </div>
            )}
          </div>
          <button 
            className="see-all-button"
            onClick={() => setShowFriendsModal(true)}
          >
            See All Friends
          </button>

          {/* Other Attendees Section */}
          <div className="section-header">
            <h2 className="section-title">Other People Going</h2>
            <span className="count-badge">{MOCK_ATTENDEES.length}</span>
          </div>
          <div className="avatar-stack">
            {MOCK_ATTENDEES.slice(0, 4).map(attendee => (
              <div 
                key={attendee.id} 
                className="avatar-item"
                onClick={() => setShowAttendeesModal(true)}
              >
                <img src={attendee.avatar} alt={attendee.name} className="avatar-image" />
                <div className={`avatar-status status-${attendee.status.toLowerCase()}`} />
              </div>
            ))}
            {MOCK_ATTENDEES.length > 4 && (
              <div 
                className="see-all-avatar"
                onClick={() => setShowAttendeesModal(true)}
              >
                +{MOCK_ATTENDEES.length - 4}
              </div>
            )}
          </div>
          <button 
            className="see-all-button"
            onClick={() => setShowAttendeesModal(true)}
          >
            See All Attendees
          </button>

          {/* Recent Activity Section */}
          <div className="activity-section">
            <div className="section-header">
              <h2 className="section-title">Recent Activity</h2>
              <span className="count-badge">{rsvps.length}</span>
            </div>
            <div className="activity-list">
              {rsvps.slice(-3).reverse().map((rsvp, index) => (
                <div key={index} className="activity-item">
                  <img 
                    src={MOCK_CURRENT_USER.avatar} 
                    alt={rsvp.name} 
                    className="activity-avatar"
                  />
                  <div className="activity-content">
                    <span className="activity-name">{rsvp.name}</span>
                    <div>
                      is {rsvp.status.toLowerCase() === 'yes' ? 'going' : 
                          rsvp.status.toLowerCase() === 'no' ? 'not going' : 'maybe going'}
                    </div>
                  </div>
                  <span className="activity-time">
                    {new Date(rsvp.updatedAt).toLocaleTimeString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <Modal 
        title="Friends Attending"
        show={showFriendsModal} 
        onClose={() => setShowFriendsModal(false)}
      >
        <div className="modal-list">
          {MOCK_FRIENDS.map(friend => (
            <div key={friend.id} className="modal-item">
              <img src={friend.avatar} alt={friend.name} className="avatar-image" />
              <div className="modal-item-content">
                <span className="modal-item-name">{friend.name}</span>
                <span className={`modal-item-status status-${friend.status.toLowerCase()}`}>
                  {friend.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </Modal>

      <Modal 
        title="Other People Going"
        show={showAttendeesModal} 
        onClose={() => setShowAttendeesModal(false)}
      >
        <div className="modal-list">
          {MOCK_ATTENDEES.map(attendee => (
            <div key={attendee.id} className="modal-item">
              <img src={attendee.avatar} alt={attendee.name} className="avatar-image" />
              <div className="modal-item-content">
                <div>
                  <span className="modal-item-name">{attendee.name}</span>
                  {attendee.mutualFriends > 0 && (
                    <div className="mutual-friends">
                      {attendee.mutualFriends} mutual friend{attendee.mutualFriends > 1 ? 's' : ''}
                    </div>
                  )}
                </div>
                <span className={`modal-item-status status-${attendee.status.toLowerCase()}`}>
                  {attendee.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </Modal>
    </div>
  );
}

export default App;
