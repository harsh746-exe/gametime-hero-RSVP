# Gametime Hero RSVP Service

A simple, focused module for managing RSVP responses for events in the Gametime Hero platform.

## Features

- Add or update player RSVPs
- Get list of confirmed attendees
- Track RSVP statistics (total, confirmed, declined, maybe)
- Dependency injection support for logging

## Installation

```bash
npm install
```

## Usage

```typescript
import { RsvpService } from './services/rsvp.service';
import { ConsoleLogger } from './utils/logger';

// Create a logger instance
const logger = new ConsoleLogger();

// Initialize the RSVP service
const rsvpService = new RsvpService(logger);

// Add a player's RSVP
const player = {
  id: '1',
  name: 'John Doe',
  email: 'john@example.com'
};

rsvpService.updateRsvp(player, 'Yes');

// Get confirmed attendees
const confirmed = rsvpService.getConfirmedAttendees();

// Get RSVP statistics
const stats = rsvpService.getRsvpStats();
```

## Testing

```bash
npm test
```

## Building

```bash
npm run build
```

## Code Style

The code follows these principles:
- Pure functions where possible
- Clear, reusable TypeScript interfaces
- Dependency injection
- Single Responsibility Principle
- Consistent naming conventions
- Early returns
- Clean separation of logic and presentation
- Derived state where appropriate

## Preview

### Main Interface
![Main Interface](https://raw.githubusercontent.com/harsh746-exe/gametime-hero-RSVP/main/preview/main-interface.png)

### RSVP Management
![RSVP Management](https://raw.githubusercontent.com/harsh746-exe/gametime-hero-RSVP/main/preview/rsvp-management.png)

### Attendee List
![Attendee List](https://raw.githubusercontent.com/harsh746-exe/gametime-hero-RSVP/main/preview/attendee-list.png)

### Statistics View
![Statistics View](https://raw.githubusercontent.com/harsh746-exe/gametime-hero-RSVP/main/preview/statistics.png) 