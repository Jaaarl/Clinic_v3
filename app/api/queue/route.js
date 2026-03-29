import { NextResponse } from 'next/server';
import connectDB from "@/libs/mongodb";
import Queue from '@/models/queue';
import QueueNum from '@/models/queueNum';

export async function GET() {
    await connectDB();
    const queueEntries = await Queue.find();
    return NextResponse.json({ queueEntries });
}

export async function DELETE(request) {
    const id = request.nextUrl.searchParams.get("id");
    await connectDB();

    const queueEntry = await Queue.findOneAndDelete({ _id: id });

    return NextResponse.json({ message: queueEntry ? "Queue entry deleted" : "Queue entry not found" }, { status: 200 });
}
export async function POST(request) {
    await connectDB();
    const { referenceId, status } = await request.json();
    const newQueueEntry = new Queue({ referenceId, status });
    const newQueueNum = new QueueNum();
    await newQueueNum.save();

    try {
        const savedEntry = await newQueueEntry.save();
        return NextResponse.json(savedEntry, { status: 201 });
    } catch (error) {
        return NextResponse.json({ message: 'Failed to create queue entry' }, { status: 500 });
    }
}
