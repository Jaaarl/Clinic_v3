import Queue from "@/models/queue";
import QueueNum from "@/models/queueNum";
import connectDB from "@/libs/mongodb";

/**
 * Queue Service - All queue-related business logic
 */
export const queueService = {
  /**
   * Get all queue entries
   * @returns {Promise<Queue[]>}
   */
  async getQueueEntries() {
    await connectDB();
    return Queue.find();
  },

  /**
   * Add a patient to the queue
   * @param {object} data - Queue entry data
   * @returns {Promise<{ queueEntry: Queue, queueNum: QueueNum }>}
   */
  async addToQueue({ referenceId, status = "waiting" }) {
    await connectDB();
    const queueEntry = new Queue({ referenceId, status });
    const queueNum = new QueueNum();
    
    await Promise.all([queueEntry.save(), queueNum.save()]);
    
    return { queueEntry, queueNum };
  },

  /**
   * Remove a queue entry
   * @param {string} id - Queue entry ID
   * @returns {Promise<Queue|null>}
   */
  async removeFromQueue(id) {
    await connectDB();
    return Queue.findOneAndDelete({ _id: id });
  },

  /**
   * Get queue numbers with optional date filtering
   * @param {object} options - Filter options
   * @returns {Promise<QueueNum[]>}
   */
  async getQueueNumbers({ startDate, endDate } = {}) {
    await connectDB();
    let query = {};

    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) {
        query.createdAt.$gte = new Date(startDate);
      }
      if (endDate) {
        const endOfDay = new Date(endDate);
        endOfDay.setHours(23, 59, 59, 999);
        query.createdAt.$lte = endOfDay;
      }
    }

    return QueueNum.find(query).sort({ createdAt: -1 }).lean();
  },

  /**
   * Create a new queue number
   * @param {object} data - Queue number data
   * @returns {Promise<QueueNum>}
   */
  async createQueueNumber(data = {}) {
    await connectDB();
    const queueNum = new QueueNum(data);
    return queueNum.save();
  },
};
