import Queue from "@/models/queue";
import QueueNum from "@/models/queueNum";
import Patient from "@/models/patient";
import connectDB from "@/lib/mongodb";

export const queueService = {
  async getQueueEntries() {
    await connectDB();
    return Queue.find();
  },

  async getQueueById(id) {
    await connectDB();
    return Queue.findById(id);
  },

  async getQueueWithPatient(id) {
    await connectDB();
    const queueEntry = await Queue.findById(id);
    if (!queueEntry) {
      throw new Error("Queue entry not found");
    }
    // Manually fetch patient since the Queue model's ref is incorrect
    const patient = await Patient.findById(queueEntry.referenceId);
    if (!patient) {
      throw new Error("Patient not found for this queue entry");
    }
    return { queueEntry, patient };
  },

  async addToQueue({ referenceId, status = "waiting" }) {
    if (!referenceId) {
      throw new Error("referenceId is required");
    }

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
