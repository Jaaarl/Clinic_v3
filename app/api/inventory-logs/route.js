import {NextResponse} from 'next/server';
import connectDB from "@/libs/mongodb";
import InventoryLog from '@/models/inventoryLog';

// GET /api/inventory-logs - Get all logs with optional filtering
export async function GET(request) {
    try {
        await connectDB();
        
        const { searchParams } = new URL(request.url);
        const inventoryId = searchParams.get('inventoryId');
        const itemName = searchParams.get('itemName');
        const action = searchParams.get('action');
        const limit = parseInt(searchParams.get('limit')) || 50;
        const page = parseInt(searchParams.get('page')) || 1;
        const skip = (page - 1) * limit;

        // Build filter object
        let filter = {};
        
        // Handle inventory ID filter (backward compatibility)
        if (inventoryId) {
            filter.inventoryId = inventoryId;
        }
        
        // Handle item name search (new feature)
        if (itemName) {
            filter.$or = [
                { 'newData.name': { $regex: itemName, $options: 'i' } },
                { 'previousData.name': { $regex: itemName, $options: 'i' } }
            ];
        }
        
        // Handle action filter
        if (action) {
            filter.action = action;
        }

        // Get logs with pagination and populate inventory details
        const logs = await InventoryLog.find(filter)
            .populate('inventoryId', 'name')
            .sort({ timestamp: -1 })
            .limit(limit)
            .skip(skip)
            .lean();

        // Get total count for pagination
        const totalCount = await InventoryLog.countDocuments(filter);

        return NextResponse.json({
            logs,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(totalCount / limit),
                totalCount,
                hasMore: skip + logs.length < totalCount
            }
        }, {status: 200});

    } catch (error) {
        console.error('Error fetching inventory logs:', error);
        return NextResponse.json({error: error.message}, {status: 500});
    }
}