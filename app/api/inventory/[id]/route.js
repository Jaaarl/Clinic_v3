import connectDB from "@/libs/mongodb";
import Inventory from '@/models/inventory';
import InventoryLog from '@/models/inventoryLog'; // Import your log model
import {NextResponse} from "next/server";

export async function OPTIONS() {
    const response = NextResponse.json({});

    // Set CORS headers for preflight requests
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'PUT, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type');

    return response;
}

export async function GET(request, {params}) {
    const {id} = params;
    await connectDB();
    const inventory = await Inventory.findOne({_id: id});
    return NextResponse.json({inventory}, {status: 200});
}

export async function PUT(request, {params}) {
    const {id} = params;
    const {name, quantityInStock, expirationDate, price, reason} = await request.json();

    await connectDB();
    
    try {
        // Get the current inventory data before updating
        const currentInventory = await Inventory.findById(id);
        
        if (!currentInventory) {
            return NextResponse.json({message: "Inventory not found"}, {status: 404});
        }

        // Calculate quantity changed
        const quantityChanged = quantityInStock - currentInventory.quantityInStock;

        // Update the inventory
        await Inventory.findByIdAndUpdate(id, {name, quantityInStock, expirationDate, price});

        // Create inventory log entry
        await InventoryLog.create({
            inventoryId: id,
            action: 'UPDATE',
            previousData: {
                name: currentInventory.name,
                quantityInStock: currentInventory.quantityInStock,
                expirationDate: currentInventory.expirationDate,
                price: currentInventory.price
            },
            newData: {
                name,
                quantityInStock,
                expirationDate,
                price
            },
            quantityChanged,
            reason: reason || 'Manual update',
            userAgent: request.headers.get('user-agent') || '',
            ipAddress: request.headers.get('x-forwarded-for') || 
                      request.headers.get('x-real-ip') || 
                      request.ip || 'unknown'
        });

        const response = NextResponse.json({message: "Inventory updated"}, {status: 200});

        // Set CORS headers for PUT requests
        response.headers.set('Access-Control-Allow-Origin', '*');
        response.headers.set('Access-Control-Allow-Methods', 'PUT');
        response.headers.set('Access-Control-Allow-Headers', 'Content-Type');

        return response;
        
    } catch (error) {
        console.error('Error updating inventory:', error);
        return NextResponse.json({message: "Error updating inventory"}, {status: 500});
    }
}