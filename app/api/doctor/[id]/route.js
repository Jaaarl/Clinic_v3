import connectDB from "@/libs/mongodb";
import Doctor from "@/models/doctor";
import { NextResponse } from "next/server";

export async function OPTIONS() {

    const response = NextResponse.json({});

    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'PUT, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type');

    return response;
}
export async function GET(request, { params }) {
    const { id } = params;
    await connectDB();
    const doctor = await Doctor.findOne({ _id: id });
    return NextResponse.json({ doctor }, { status: 200 });
}

export async function PUT(request, { params }) {
    const { id } = params;
    const { name , lic , ptr, s2 } = await request.json();

    await connectDB();
    await Doctor.findByIdAndUpdate(id, { name , lic , ptr, s2 });

    const response = NextResponse.json({ message: "Doctor updated" }, { status: 200 });

    // Set CORS headers for PUT requests
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'PUT');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type');

    return response;
}