import {IEvent} from "@/database/event.model"

export async function getEvents(): Promise<IEvent[]> {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/events`, {
        next: { revalidate: 100 }
    });

    if (!response.ok) {
        throw new Error('Failed to fetch events');
    }

    return await response.json();
}

export async function getEvent(slug: string): Promise<IEvent> {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/events/${slug}`, {
        next: { revalidate: 100 }
    });

    if (!response.ok) {
        throw new Error('Failed to fetch events');
    }

    return await response.json();
}