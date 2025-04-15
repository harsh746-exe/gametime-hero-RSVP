# Event RSVP System

A modern, interactive event RSVP system built with React and TypeScript. This system allows users to manage event responses, view attendees, and track event statistics in real-time.

## Development Environment Setup

### Prerequisites
- Node.js (v16.x or higher)
- npm (v8.x or higher)
- Git

### Recommended IDE Setup
- VS Code with the following extensions:
  - ESLint
  - Prettier
  - TypeScript and JavaScript Language Features
  - React Developer Tools
  - GitLens

### Global Dependencies
```bash
npm install -g typescript
npm install -g eslint
npm install -g prettier
```

## Features

### 1. Event Information
- Detailed event display with title, description, location, and time
- Formatted date and time presentation
- Visual icons for better user experience

### 2. RSVP Management
- Three response options:
  - Yes (Attending)
  - No (Not Attending)
  - Maybe (Tentative)
- Real-time status updates
- Activity tracking for responses

### 3. Attendee Management
- Separate sections for:
  - Friends attending
  - Other attendees
- Avatar stacks with status indicators
  - Green: Attending
  - Red: Not attending
  - Yellow: Maybe
- Modal views for full attendee lists

### 4. Statistics
- Real-time stats tracking:
  - Number of confirmed attendees
  - Number of maybe responses
  - Available spots remaining
- Automatic updates when RSVPs change

### 5. User Interface
- Clean, modern design
- Responsive layout
- Interactive elements with hover states
- Modal dialogs for detailed information

## Project Structure

```
rsvp-demo/
├── src/
│   ├── features/
│   │   ├── events/
│   │   │   ├── data/
│   │   │   │   └── mock.data.ts    # Mock data and calculations
│   │   │   ├── services/
│   │   │   │   └── event.service.ts # Event-related services
│   │   │   └── types/
│   │   │       ├── event.types.ts   # Event-related types
│   │   │       └── rsvp.types.ts    # RSVP-related types
│   │   └── auth/
│   │       └── services/
│   │           ├── auth.service.ts  # Authentication service
│   │           └── logger.service.ts # Logging service
│   ├── App.tsx                      # Main application component
│   ├── App.css                      # Application styles
│   └── index.tsx                    # Application entry point
```

## Mock Data Structure

### Event Data
- Event details including title, description, location, time
- Maximum attendee capacity
- Event status and category

### User Types
1. Current User
   - Basic user information
   - Avatar
   - RSVP status

2. Friends
   - Name and avatar
   - RSVP status
   - Individual response tracking

3. Other Attendees
   - Name and avatar
   - Mutual friends count
   - Always marked as attending

## Stats Calculation

The system calculates various statistics:
1. Total Going = Friends(Yes) + All Attendees + Current User(if Yes)
2. Total Maybe = Friends(Maybe) + Current User(if Maybe)
3. Total Declined = Friends(No) + Current User(if No)
4. Available Spots = MaxAttendees - Total Going

## Components

### Main App Component
- Manages overall layout and state
- Handles RSVP submissions
- Updates statistics

### Modal Component
- Reusable modal dialog
- Used for displaying full lists of friends and attendees
- Click-outside to close functionality

### Avatar Stack
- Shows first 4 avatars
- "+X more" indicator for additional members
- Status indicators for each avatar

## Styling

The application uses modern CSS with:
- Flexbox for layout
- CSS Grid for statistics
- Transitions and hover effects
- Responsive design considerations
- Status-based color coding

## Code Style Guidelines

### Naming Conventions
- Components: PascalCase (e.g., `EventCard.tsx`)
- Functions: camelCase (e.g., `handleSubmit`)
- Variables: camelCase (e.g., `eventStats`)
- Constants: UPPER_SNAKE_CASE (e.g., `MAX_ATTENDEES`)
- Interfaces: PascalCase with 'I' prefix (e.g., `IEventData`)

### File Organization
- One component per file
- Related components in feature folders
- Services in dedicated service folders
- Types in dedicated type files

### Code Formatting
- Use Prettier for consistent formatting
- Maximum line length: 100 characters
- Use semicolons
- Use double quotes for strings
- Use 2 spaces for indentation

## Testing

### Available Commands
```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage
```

### Testing Strategy
- Unit tests for services and utilities
- Component tests for UI elements
- Integration tests for feature workflows
- Mock data for consistent testing

## Debugging Guide

### Common Issues
1. **Type Errors**
   - Check type definitions in `*.types.ts` files
   - Ensure all required props are passed
   - Verify interface implementations

2. **State Management**
   - Use React DevTools to inspect state
   - Check useEffect dependencies
   - Verify state updates are synchronous

3. **Styling Issues**
   - Use browser DevTools to inspect elements
   - Check CSS specificity
   - Verify responsive breakpoints

### Debugging Tools
- React Developer Tools
- Redux DevTools (if using Redux)
- Chrome DevTools
- VS Code Debugger

## Integration Points

To integrate with a real backend:
1. Replace mock data in `mock.data.ts` with API calls
2. Update `EventService` to make real API requests
3. Implement proper authentication in `AuthService`
4. Add error handling for API responses

## API Documentation

### Endpoints
```typescript
// Event endpoints
GET /api/events/:id          // Get event details
POST /api/events/:id/rsvp    // Submit RSVP
GET /api/events/:id/stats    // Get event statistics

// User endpoints
GET /api/users/me            // Get current user
GET /api/users/:id/friends   // Get user's friends
```

### Authentication
- JWT-based authentication
- Token stored in localStorage
- Automatic token refresh

### Error Handling
- Standard HTTP status codes
- Consistent error response format
- Client-side error logging

## Getting Started

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd rsvp-demo
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. Start the development server:
   ```bash
   npm start
   ```

5. Run tests:
   ```bash
   npm test
   ```

6. Build for production:
   ```bash
   npm run build
   ```

## Deployment

### Environment Variables
```env
REACT_APP_API_URL=https://api.example.com
REACT_APP_AUTH_TOKEN=your-auth-token
REACT_APP_ENV=production
```

### Build Process
1. Run tests
2. Build production bundle
3. Deploy to hosting service
4. Verify deployment

### Deployment Checklist
- [ ] All tests passing
- [ ] Environment variables set
- [ ] Build successful
- [ ] Assets optimized
- [ ] CDN configured
- [ ] Monitoring set up

## Contributing

### Branch Naming
- feature/feature-name
- bugfix/bug-description
- hotfix/issue-description
- release/version-number

### Pull Request Process
1. Create feature branch
2. Make changes
3. Run tests
4. Update documentation
5. Create pull request
6. Address review comments
7. Merge after approval

### Code Review Requirements
- All tests passing
- Documentation updated
- Code style followed
- No console.log statements
- Proper error handling
- Performance considered

## Dependencies

### Key Packages
```json
{
  "dependencies": {
    "react": "^18.2.0",
    "typescript": "^4.9.0",
    "axios": "^1.3.0",
    "date-fns": "^2.29.0"
  },
  "devDependencies": {
    "@types/react": "^18.0.0",
    "eslint": "^8.0.0",
    "prettier": "^2.8.0",
    "jest": "^29.0.0"
  }
}
```

### Version Compatibility
- React 18.x
- TypeScript 4.x
- Node.js 16.x or higher

## Future Enhancements

Potential areas for expansion:
- Real-time updates using WebSocket
- Email notifications for RSVP changes
- Calendar integration
- Social sharing features
- Waitlist functionality
- Guest list management
- Event series support

## Technical Considerations

- TypeScript for type safety
- React for UI components
- Modular architecture for scalability
- Service-based approach for backend integration
- Responsive design for mobile support

## Support

For issues and feature requests:
1. Check existing issues
2. Create new issue with:
   - Description
   - Steps to reproduce
   - Expected behavior
   - Actual behavior
   - Environment details

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
