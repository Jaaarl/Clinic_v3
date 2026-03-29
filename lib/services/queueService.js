import Queue from "@/models/queue";
import QueueNum from "@/models/queueNum";
import connectDB from "@/libs/mongodb";

export const queueService = {
  async getQueueEntries() {
    await connectDB();
    return Queue.find();
  },

  async addToQueue({ referenceId, status = "waiting" }) {
    await connectDB();
    const queueEntry = new Queue({ referenceId, status });
    const queueNum = new QueueNum();
    await Promise.all([queueEntry.save(), queueNum.save()]);
    return { queueEntry, queueNum };
  },

  async removeFromQueue(id) {
    await connectDB();
    return Queue.findOneAndDelete({ _id: id });
  },

  async getQueueNumbers({ startDate, endDate } = {}) {
    await connectDB();
    let query = {};
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) {
        const endOfDay = new Date(endDate);
        endOfDay.setHours(23, 59, 59, 999);
        query.createdAt.$lte = endOfDay;
      }
    }
    return QueueNum.find(query).sort({ createdAt: -1 }).lean();
  },

  async createQueueNumber(data = {}) {
    await connectDB();
    const queueNum = new QueueNum(data);
    return queueNum.save();
  },
};
