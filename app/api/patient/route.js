import connectDB from "@/libs/mongodb";
import Patient from "@/models/patient";
import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        const { name, gender, contact, medical_history, medications, visit_history, birthday } = await request.json();
        await connectDB();
        await Patient.create({ name, gender, contact, medical_history, medications, visit_history, birthday });
        return NextResponse.json({ message: "Patient Created" }, { status: 201 });
    } catch (error) {
        console.error("Error creating patient:", error);
        return NextResponse.json({ error: "Failed to create patient" }, { status: 500 });
    }
}


export async function GET(request) {
    try {
        await connectDB();

        const searchParams = request.nextUrl.searchParams;
        const searchQuery = searchParams.get("search");

        let patients;
        if (searchQuery) {
            patients = await Patient.find({ name: { $regex: searchQuery, $options: "i" } });
        } else {
            patients = await Patient.find();
        }

        return NextResponse.json({ patients }, { status: 200 });
    } catch (error) {
        console.error("Error fetching patients:", error);
        return NextResponse.json({ error: "Failed to fetch patients" }, { status: 500 });
    }
}



export async function DELETE(request) {
    const id = request.nextUrl.searchParams.get("id")
    await connectDB();
    await Patient.findByIdAndDelete(id);
    return NextResponse.json({ message: "Patient deleted" }, { status: 200 });
}