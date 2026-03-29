import {NextResponse} from 'next/server';
import connectDB from "@/libs/mongodb";
import Inventory from '@/models/inventory';
import InventoryLog from '@/models/inventoryLog';

// Helper function to create log entries
async function createLog(inventoryId, action, previousData = null, newData = null, quantityChanged = 0, reason = '', request = null) {
    try {
        const logData = {
            inventoryId,
            action,
            quantityChanged,
            reason,
            timestamp: new Date()
        };

        if (previousData) logData.previousData = previousData;
        if (newData) logData.newData = newData;
        
        // Extract request info if available
        if (request) {
            logData.userAgent = request.headers.get('user-agent') || '';
            logData.ipAddress = request.headers.get('x-forwarded-for') || 
                               request.headers.get('x-real-ip') || 
                               request.ip || '';
        }

        const log = new InventoryLog(logData);
        await log.save();
    } catch (error) {
        console.error('Error creating inventory log:', error);
        // Don't throw error to prevent breaking main functionality
    }
}

export async function GET() {
    await connectDB();
    const inventoryItems = await Inventory.find({});
    return NextResponse.json({inventoryItems}, {status: 200});
}

export async function POST(req) {
    try {
        const {name, quantityInStock, expirationDate, price} = await req.json();

        await connectDB();

        const newInventoryItem = new Inventory({
            name,
            quantityInStock,
            expirationDate,
            price,
        });

        await newInventoryItem.save();

        // Create log entry for item creation
        await createLog(
            newInventoryItem._id,
            'CREATE',
            null,
            {
                name: newInventoryItem.name,
                quantityInStock: newInventoryItem.quantityInStock,
                expirationDate: newInventoryItem.expirationDate,
                price: newInventoryItem.price
            },
            quantityInStock,
            'New inventory item created',
            req
        );

        return NextResponse.json({message: 'Item added successfully', newInventoryItem}, {status: 201});
    } catch (error) {
        return NextResponse.json({error: error.message}, {status: 500});
    }
}

export async function DELETE(request) {
    try {
        const id = request.nextUrl.searchParams.get("id");
        
        if (!id) {
            return NextResponse.json({error: "ID parameter is required"}, {status: 400});
        }

        await connectDB();
        
        // Get the item data before deletion for logging
        const itemToDelete = await Inventory.findById(id);
        
        if (!itemToDelete) {
            return NextResponse.json({error: "Item not found"}, {status: 404});
        }

        await Inventory.findByIdAndDelete(id);

        // Create log entry for item deletion
        await createLog(
            id,
            'DELETE',
            {
                name: itemToDelete.name,
                quantityInStock: itemToDelete.quantityInStock,
                expirationDate: itemToDelete.expirationDate,
                price: itemToDelete.price
            },
            null,
            -itemToDelete.quantityInStock,
            'Inventory item deleted',
            request
        );

        return NextResponse.json({ message: "Inventory deleted" }, { status: 200 });
    } catch (error) {
        return NextResponse.json({error: error.message}, {status: 500});
    }
}

export async function PATCH(request) {
    try {
        const id = request.nextUrl.searchParams.get("id");
        const quantityToDeduct = parseInt(request.nextUrl.searchParams.get("quantityToDeduct"));

        if (!id || !quantityToDeduct) {
            return NextResponse.json({error: "ID and quantityToDeduct parameters are required"}, {status: 400});
        }

        await connectDB();
        const inventory = await Inventory.findOne({_id: id});

        if (!inventory) {
            return NextResponse.json({error: "Item not found"}, {status: 404});
        }

        // Store previous data for logging
        const previousData = {
            name: inventory.name,
            quantityInStock: inventory.quantityInStock,
            expirationDate: inventory.expirationDate,
            price: inventory.price
        };

        if (inventory.quantityInStock < quantityToDeduct) {
            return NextResponse.json({error: "Not enough stock to deduct"}, {status: 400});
        }

        inventory.quantityInStock -= quantityToDeduct;
        await inventory.save();

        // Create log entry for stock deduction
        await createLog(
            inventory._id,
            'STOCK_DEDUCTION',
            previousData,
            {
                name: inventory.name,
                quantityInStock: inventory.quantityInStock,
                expirationDate: inventory.expirationDate,
                price: inventory.price
            },
            -quantityToDeduct,
            `Stock deducted: ${quantityToDeduct} units`,
            request
        );

        let response = NextResponse.json({message: "Inventory updated"}, {status: 200});

        response.headers.set('Access-Control-Allow-Origin', '*');
        response.headers.set('Access-Control-Allow-Methods', 'PATCH');
        response.headers.set('Access-Control-Allow-Headers', 'Content-Type');

        return response;
    } catch (error) {
        console.error('PATCH error:', error);
        return NextResponse.json({error: error.message}, {status: 500});
    }
}