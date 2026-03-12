import mongoose, { Schema, Document, Types } from 'mongoose';
import { Event } from './event.model'; // Import Event model for reference validation

// Interface for the Booking document - provides strong typing for TypeScript
export interface IBooking extends Document {
  eventId: Types.ObjectId; // Reference to Event collection
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

// Email validation regex pattern - follows RFC 5322 standard for email validation
const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

// Define the Booking schema with reference validation
const BookingSchema = new Schema<IBooking>(
  {
    eventId: {
      type: Schema.Types.ObjectId,
      ref: 'Event', // Reference to Event model for population queries
      required: [true, 'Event ID is required'],
      index: true, // Index for fast event-based booking lookups
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true, // Normalize email to lowercase for consistency
      validate: {
        validator: function (email: string) {
          return EMAIL_REGEX.test(email);
        },
        message: 'Please provide a valid email address',
      },
    },
  },
  {
    timestamps: true, // Auto-generates createdAt and updatedAt
    strict: true, // Ensures no undefined fields are saved
  }
);

// Compound index to prevent duplicate bookings (one booking per email per event)
BookingSchema.index({ eventId: 1, email: 1 }, { unique: true });

// Pre-save hook: Verify that the referenced event exists
// This ensures data integrity by preventing bookings for non-existent events
BookingSchema.pre<IBooking>('save', async function () {
  const booking = this;

  // Only validate event existence if eventId was modified (optimization)
  if (booking.isModified('eventId') || booking.isNew) {
    const eventExists = await Event.exists({ _id: booking.eventId });
    
    if (!eventExists) {
      throw new Error(`Event with ID ${booking.eventId} does not exist`);
    }
  }
});

// Export the Booking model
export const Booking = mongoose.models.Booking || mongoose.model<IBooking>('Booking', BookingSchema);
