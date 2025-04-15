# Events Management Feature

This feature module handles all event-related functionality including:
- Event creation, updating, and deletion
- Event RSVPs and attendance tracking
- Event statistics and reporting

## Directory Structure

```
events/
├── components/     # React components for event management
├── hooks/         # Custom React hooks for event operations
├── services/      # Business logic and data management
├── types/         # TypeScript type definitions
└── utils/         # Helper functions and constants
```

## Integration Guide

1. Add the following dependencies to your package.json:
   ```json
   {
     "dependencies": {
       "date-fns": "^2.30.0"  // For date manipulation
     }
   }
   ```

2. Import and initialize the EventService:
   ```typescript
   import { EventService } from './features/events/services/event.service';
   import { AuthService } from './services/auth.service';

   const authService = new AuthService();
   const eventService = new EventService(authService);
   ```

3. Use the service in your components:
   ```typescript
   const events = await eventService.getEvents();
   ```

## Type Definitions

- `Event`: Represents an event with all its properties
- `EventRsvp`: Represents a user's RSVP for an event
- `EventStats`: Contains statistics about event attendance
- `UserEvent`: Combines event data with user-specific information

## Authentication Requirements

The EventService requires an authenticated user for certain operations:
- Creating events
- Updating events
- Deleting events
- Managing RSVPs

Ensure the AuthService is properly initialized before using these features. 