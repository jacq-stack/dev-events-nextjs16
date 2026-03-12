import { Event } from "@/database/event.model";
import connectDB from "@/lib/mongodb";
import {NextRequest, NextResponse} from "next/server";

export async function GET(request: NextRequest, { params }: { params: Promise<{ slug: string }> }): Promise<NextResponse> {
    const { slug } = await params;

    if (!slug) {
        throw new Error('Invalid slug');
    }

    await connectDB();

    try {
        const event = await Event.findOne({ slug });

        if (!event) {
            console.error(`Event with slug: ${slug} not found`);
            return NextResponse.json({ message: 'Event not found' }, { status: 404 });
        }

        return NextResponse.json(event, { status: 200 });
    } catch (e) {
        console.error(e);
        return NextResponse.json({ message: 'Event Fetch Failed', error: e instanceof Error ? e.message : 'Unknown Error' }, { status: 500});
    }
}