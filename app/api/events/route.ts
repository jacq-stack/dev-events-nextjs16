import {NextRequest, NextResponse} from "next/server";
import connectDB from "@/lib/mongodb";
import {Event} from "@/database/event.model"

export async function POST(req: NextRequest) {
    try {
        const events = [];

        await connectDB();

        try {
            const fetchedEvents = await req.json();

            for (const fetchedEvent of fetchedEvents) {
                const event = await Event.create(fetchedEvent);
                events.push(event);
            }
        } catch (e) {
            return NextResponse.json({ message: 'Invalid JSON data format', error: e}, { status: 400 })
        }

        return NextResponse.json({ message: 'Event Created Successfully', event: events }, { status: 201 })
    } catch (e) {
        console.error(e);
        return NextResponse.json({ message: 'Event Creation Failed', error: e instanceof Error ? e.message : 'Unknown Error' }, { status: 500})
    }
}

export async function GET(req: NextRequest, res: NextResponse) {
    try {
        await connectDB();

        const events = await Event.find().sort({ createdAt: -1 });
        return NextResponse.json(events, { status: 201 });
    } catch (e) {
        console.error(e);
        return NextResponse.json({ message: 'Event Fetch Failed', error: e instanceof Error ? e.message : 'Unknown Error' }, { status: 500});
    }
}