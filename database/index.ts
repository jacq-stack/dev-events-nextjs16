// Central export point for all database models
// Import from this single file anywhere in the application

export { Event } from './event.model';
export { Booking } from './booking.model';

// Re-export types separately for TypeScript isolatedModules compatibility
export type { IEvent } from './event.model';
export type { IBooking } from './booking.model';
