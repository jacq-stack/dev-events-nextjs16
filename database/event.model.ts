import mongoose, { Schema, Document } from 'mongoose';

// Interface for the Event document - provides strong typing for TypeScript
export interface IEvent extends Document {
  title: string;
  slug: string;
  description: string;
  overview: string;
  image: string;
  venue: string;
  location: string;
  date: string;
  time: string;
  mode: string;
  audience: string;
  agenda: string[];
  organizer: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

// Helper function to generate URL-friendly slug from title
// Converts to lowercase, removes special chars, replaces spaces with hyphens
const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-'); // Remove consecutive hyphens
};

// Helper function to normalize date to ISO format (YYYY-MM-DD)
const normalizeDate = (dateString: string): string => {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    throw new Error('Invalid date format provided');
  }
  return date.toISOString().split('T')[0]; // Extract YYYY-MM-DD
};

// Helper function to normalize time to 24-hour format (HH:MM)
const normalizeTime = (timeString: string): string => {
  // Handle both 12-hour (2:30 PM) and 24-hour (14:30) formats
  const trimmedTime = timeString.trim().toUpperCase();
  
  // Check for 12-hour format with AM/PM
  const twelveHourMatch = trimmedTime.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/);
  if (twelveHourMatch) {
    let hours = parseInt(twelveHourMatch[1], 10);
    const minutes = twelveHourMatch[2];
    const period = twelveHourMatch[3];
    
    if (period === 'PM' && hours !== 12) {
      hours += 12;
    } else if (period === 'AM' && hours === 12) {
      hours = 0;
    }
    
    return `${hours.toString().padStart(2, '0')}:${minutes}`;
  }
  
  // Check for 24-hour format
  const twentyFourHourMatch = trimmedTime.match(/^(\d{2}):(\d{2})$/);
  if (twentyFourHourMatch) {
    const hours = parseInt(twentyFourHourMatch[1], 10);
    const minutes = twentyFourHourMatch[2];
    
    if (hours < 0 || hours > 23 || parseInt(minutes) < 0 || parseInt(minutes) > 59) {
      throw new Error('Invalid time format provided');
    }
    
    return `${hours.toString().padStart(2, '0')}:${minutes}`;
  }
  
  throw new Error('Time must be in HH:MM or HH:MM AM/PM format');
};

// Define the Event schema with all required fields
const EventSchema = new Schema<IEvent>(
  {
    title: {
      type: String,
      required: [true, 'Event title is required'],
      trim: true,
      minlength: [1, 'Title cannot be empty'],
    },
    slug: {
      type: String,
      unique: true,
      index: true, // Unique index for fast lookups by slug
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Event description is required'],
      trim: true,
      minlength: [1, 'Description cannot be empty'],
    },
    overview: {
      type: String,
      required: [true, 'Event overview is required'],
      trim: true,
      minlength: [1, 'Overview cannot be empty'],
    },
    image: {
      type: String,
      required: [true, 'Event image URL is required'],
      trim: true,
      minlength: [1, 'Image URL cannot be empty'],
    },
    venue: {
      type: String,
      required: [true, 'Event venue is required'],
      trim: true,
      minlength: [1, 'Venue cannot be empty'],
    },
    location: {
      type: String,
      required: [true, 'Event location is required'],
      trim: true,
      minlength: [1, 'Location cannot be empty'],
    },
    date: {
      type: String,
      required: [true, 'Event date is required'],
      trim: true,
    },
    time: {
      type: String,
      required: [true, 'Event time is required'],
      trim: true,
    },
    mode: {
      type: String,
      required: [true, 'Event mode is required'],
      trim: true,
      enum: {
        values: ['online', 'offline', 'hybrid'],
        message: 'Mode must be online, offline, or hybrid',
      },
    },
    audience: {
      type: String,
      required: [true, 'Target audience is required'],
      trim: true,
      minlength: [1, 'Audience cannot be empty'],
    },
    agenda: {
      type: [String],
      required: [true, 'Event agenda is required'],
      validate: {
        validator: function (agenda: string[]) {
          return Array.isArray(agenda) && agenda.length > 0 && agenda.every(item => item.trim().length > 0);
        },
        message: 'Agenda must be a non-empty array of non-empty strings',
      },
    },
    organizer: {
      type: String,
      required: [true, 'Event organizer is required'],
      trim: true,
      minlength: [1, 'Organizer cannot be empty'],
    },
    tags: {
      type: [String],
      required: [true, 'Event tags are required'],
      validate: {
        validator: function (tags: string[]) {
          return Array.isArray(tags) && tags.length > 0 && tags.every(tag => tag.trim().length > 0);
        },
        message: 'Tags must be a non-empty array of non-empty strings',
      },
    },
  },
  {
    timestamps: true, // Auto-generates createdAt and updatedAt
    strict: true, // Ensures no undefined fields are saved
  }
);

// Pre-save hook: Generate slug from title and normalize date/time
// Only regenerates slug if title has been modified (to preserve existing URLs)
EventSchema.pre<IEvent>('save', async function () {
  const event = this;

  // Generate slug only if title is new or modified - prevents breaking existing URLs
  if (event.isModified('title')) {
    event.slug = generateSlug(event.title);
  }

  // Normalize date to consistent ISO format (YYYY-MM-DD)
  if (event.isModified('date') || event.isNew) {
    event.date = normalizeDate(event.date);
  }

  // Normalize time to 24-hour format (HH:MM)
  if (event.isModified('time') || event.isNew) {
    event.time = normalizeTime(event.time);
  }
});

// Compound index for common query patterns (by date and mode)
EventSchema.index({ date: 1, mode: 1 });

// Export the Event model
export const Event = mongoose.models.Event || mongoose.model<IEvent>('Event', EventSchema);
