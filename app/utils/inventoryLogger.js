import InventoryLog from '@/models/inventoryLog';
import connectDB from '@/lib/mongodb';

/**
 * Utility class for logging inventory changes
 */
export class InventoryLogger {
    
    /**
     * Create a log entry for inventory changes
     * @param {Object} options - Logging options
     * @param {string} options.inventoryId - MongoDB ObjectId of the inventory item
     * @param {string} options.action - Action type (CREATE, UPDATE, DELETE, STOCK_DEDUCTION)
     * @param {Object} options.previousData - Previous state of the inventory item
     * @param {Object} options.newData - New state of the inventory item
     * @param {number} options.quantityChanged - Quantity change (positive for additions, negative for deductions)
     * @param {string} options.reason - Reason for the change
     * @param {Request} options.request - Next.js request object (optional)
     * @param {Object} options.metadata - Additional metadata (optional)
     */
    static async log({
        inventoryId,
        action,
        previousData = null,
        newData = null,
        quantityChanged = 0,
        reason = '',
        request = null,
        metadata = {}
    }) {
        try {
            await connectDB();

            const logData = {
                inventoryId,
                action,
                quantityChanged,
                reason,
                timestamp: new Date(),
                ...metadata
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
            
            return log;
        } catch (error) {
            console.error('Error creating inventory log:', error);
            throw error;
        }
    }

    /**
     * Log inventory creation
     */
    static async logCreate(inventoryId, newData, request = null, reason = 'New inventory item created') {
        return this.log({
            inventoryId,
            action: 'CREATE',
            newData,
            quantityChanged: newData.quantityInStock || 0,
            reason,
            request
        });
    }

    /**
     * Log inventory update
     */
    static async logUpdate(inventoryId, previousData, newData, request = null, reason = 'Inventory item updated') {
        const quantityChanged = (newData.quantityInStock || 0) - (previousData.quantityInStock || 0);
        return this.log({
            inventoryId,
            action: 'UPDATE',
            previousData,
            newData,
            quantityChanged,
            reason,
            request
        });
    }

    /**
     * Log inventory deletion
     */
    static async logDelete(inventoryId, previousData, request = null, reason = 'Inventory item deleted') {
        return this.log({
            inventoryId,
            action: 'DELETE',
            previousData,
            quantityChanged: -(previousData.quantityInStock || 0),
            reason,
            request
        });
    }

    /**
     * Log stock deduction
     */
    static async logStockDeduction(inventoryId, previousData, newData, quantityDeducted, request = null, reason = null) {
        return this.log({
            inventoryId,
            action: 'STOCK_DEDUCTION',
            previousData,
            newData,
            quantityChanged: -quantityDeducted,
            reason: reason || `Stock deducted: ${quantityDeducted} units`,
            request
        });
    }

    /**
     * Get logs for a specific inventory item
     */
    static async getLogsForItem(inventoryId, limit = 50, page = 1) {
        try {
            await connectDB();
            
            const skip = (page - 1) * limit;
            
            const logs = await InventoryLog.find({ inventoryId })
                .sort({ timestamp: -1 })
                .limit(limit)
                .skip(skip)
                .lean();

            const totalCount = await InventoryLog.countDocuments({ inventoryId });

            return {
                logs,
                pagination: {
                    currentPage: page,
                    totalPages: Math.ceil(totalCount / limit),
                    totalCount,
                    hasMore: skip + logs.length < totalCount
                }
            };
        } catch (error) {
            console.error('Error fetching logs for item:', error);
            throw error;
        }
    }

    /**
     * Get logs by action type
     */
    static async getLogsByAction(action, limit = 50, page = 1) {
        try {
            await connectDB();
            
            const skip = (page - 1) * limit;
            
            const logs = await InventoryLog.find({ action })
                .populate('inventoryId', 'name')
                .sort({ timestamp: -1 })
                .limit(limit)
                .skip(skip)
                .lean();

            const totalCount = await InventoryLog.countDocuments({ action });

            return {
                logs,
                pagination: {
                    currentPage: page,
                    totalPages: Math.ceil(totalCount / limit),
                    totalCount,
                    hasMore: skip + logs.length < totalCount
                }
            };
        } catch (error) {
            console.error('Error fetching logs by action:', error);
            throw error;
        }
    }

    /**
     * Get inventory activity summary
     */
    static async getActivitySummary(inventoryId = null, days = 30) {
        try {
            await connectDB();
            
            const startDate = new Date();
            startDate.setDate(startDate.getDate() - days);
            
            const matchFilter = { timestamp: { $gte: startDate } };
            if (inventoryId) matchFilter.inventoryId = inventoryId;

            const summary = await InventoryLog.aggregate([
                { $match: matchFilter },
                {
                    $group: {
                        _id: '$action',
                        count: { $sum: 1 },
                        totalQuantityChanged: { $sum: '$quantityChanged' }
                    }
                }
            ]);

            return summary;
        } catch (error) {
            console.error('Error getting activity summary:', error);
            throw error;
        }
    }
}

export default InventoryLogger;