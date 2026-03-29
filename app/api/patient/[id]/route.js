import connectDB from "@/libs/mongodb";
import Patient from "@/models/patient";
import { NextResponse } from "next/server";

// Handle OPTIONS requests for CORS preflight
export async function OPTIONS() {
    const response = NextResponse.json({});

    // Set CORS headers for preflight requests
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'PUT, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type');

    return response;
}
export async function GET(request, { params }) {
    const { id } = params;
    await connectDB();
    const patient = await Patient.findOne({ _id: id });
    return NextResponse.json({ patient }, { status: 200 });
}

export async function PUT(request, { params }) {
    const { id } = params;
    const { name, age, gender, contact, medical_history, medications, visit_history, birthday } = await request.json();

    await connectDB();
    await Patient.findByIdAndUpdate(id, { name, age, gender, contact, medical_history, medications, visit_history, birthday });

    const response = NextResponse.json({ message: "Patient updated" }, { status: 200 });

    // Set CORS headers for PUT requests
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'PUT');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type');

    return response;
}

