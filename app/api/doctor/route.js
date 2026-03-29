import connectDB from "@/libs/mongodb";
import Doctor from "@/models/doctor";
import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        const { name , lic , ptr, s2 } = await request.json();
        await connectDB();
        await Doctor.create({ name , lic , ptr, s2 });
        return NextResponse.json({ message: "Doctor Created" }, { status: 201 });
    } catch (error) {
        console.error("Error creating doctor:", error);
        return NextResponse.json({ error: "Failed to create doctor" }, { status: 500 });
    }
}

export async function GET() {
    try {
        await connectDB();
        const doctors = await Doctor.find(); 
        return NextResponse.json({ doctors }, { status: 200 });
    } catch (error) {
        console.error('Error fetching doctors:', error); 
        return NextResponse.json({ error: 'Failed to fetch doctors' }, { status: 500 });
    }
}
