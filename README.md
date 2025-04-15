# Event RSVP System

A modern, interactive event RSVP system built with React and TypeScript. This system allows users to manage event responses, view attendees, and track event statistics in real-time.

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
![Main Interface](preview/main.png)
*The main event interface showing event details and RSVP options*

### RSVP Management
![RSVP Options](preview/RSVP.png)
*RSVP options allowing users to select their attendance status*

### Attendee List
![Attendee List](preview/attendee.png)
*Detailed view of friends and other attendees with their RSVP status*

### Statistics View
![Statistics](preview/stats.png)
*Real-time statistics showing attendance numbers and available spots*

## Development Environment Setup

```bash
npm install
```
