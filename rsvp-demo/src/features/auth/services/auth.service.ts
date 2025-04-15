import { User } from '../../events/types/event.types';

/**
 * Service for handling authentication and user management
 */
export class AuthService {
  private currentUser: User | null = null;

  constructor() {
    // In a real application, you would check for an existing session here
    // For demo purposes, we'll just initialize with null
  }

  /**
   * Gets the currently authenticated user
   * @returns The current user or null if not authenticated
   */
  getCurrentUser(): User | null {
    return this.currentUser;
  }

  /**
   * Sets the current user
   * @param user The user to set as current
   */
  setCurrentUser(user: User): void {
    this.currentUser = user;
  }

  /**
   * Clears the current user (logout)
   */
  clearCurrentUser(): void {
    this.currentUser = null;
  }

  /**
   * Checks if a user is authenticated
   * @returns True if a user is authenticated, false otherwise
   */
  isAuthenticated(): boolean {
    return this.currentUser !== null;
  }
} 