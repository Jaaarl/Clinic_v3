import QueueEntry from "@/models/queueEntry";
import Appointment from "@/models/appointment";
import QueueWaitlist from "@/models/queueWaitlist";
import connectDB from "@/lib/mongodb";

export const queueService = {
  /**
   * Get today's queue for all doctors, grouped by type
   */
  async getTodayQueue() {
    await connectDB();

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const entries = await QueueEntry.find({
      date: { $gte: today, $lt: tomorrow },
    })
      .populate("patientId")
      .populate("doctorId")
      .sort({ queueType: 1, scheduledTime: 1, createdAt: 1 })
      .lean();

    // Group by queue type
    const scheduled = entries.filter((e) => e.queueType === "SCHEDULED");
    const walkIns = entries.filter((e) => e.queueType === "WALK_IN");

    return { scheduled, walkIns };
  },

  /**
   * Get queue for a specific doctor
   */
  async getDoctorQueue(doctorId) {
    await connectDB();

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const entries = await QueueEntry.find({
      doctorId,
      date: { $gte: today, $lt: tomorrow },
    })
      .populate("patientId")
      .sort({ queueType: 1, scheduledTime: 1, createdAt: 1 })
      .lean();

    const scheduled = entries.filter((e) => e.queueType === "SCHEDULED");
    const walkIns = entries.filter((e) => e.queueType === "WALK_IN");

    return {
      scheduled,
      walkIns,
      doctorId,
      date: today,
    };
  },

  /**
   * Add a walk-in patient to the queue
   */
  async addWalkIn(data) {
    const { patientId, doctorId, visitReason } = data;

    await connectDB();

    if (!patientId || !doctorId || !visitReason) {
      throw new Error("patientId, doctorId, and visitReason are required");
    }

    const queueEntry = await QueueEntry.create({
      patientId,
      doctorId,
      queueType: "WALK_IN",
      visitReason,
      status: "WAITING",
      date: new Date(),
      checkedInAt: new Date(),
      statusHistory: [{ status: "WAITING", timestamp: new Date(), changedBy: "staff" }],
    });

    return queueEntry;
  },

  /**
   * Add a patient to the queue (general method for both SCHEDULED and WALK_IN)
   */
  async addToQueue(data) {
    const { patientId, doctorId, appointmentId, visitReason, queueType } = data;

    await connectDB();

    if (!patientId || !doctorId) {
      throw new Error("patientId and doctorId are required");
    }

    const queueEntry = await QueueEntry.create({
      patientId,
      doctorId,
      queueType: queueType || "WALK_IN",
      appointmentId,
      visitReason: visitReason || "Visit",
      status: "WAITING",
      date: new Date(),
      checkedInAt: new Date(),
      statusHistory: [{ status: "WAITING", timestamp: new Date(), changedBy: "staff" }],
    });

    // If this is from an appointment, update the appointment
    if (appointmentId) {
      await Appointment.findByIdAndUpdate(appointmentId, {
        queueEntryId: queueEntry._id,
        status: "DONE",
      });
    }

    return queueEntry;
  },

  /**
   * Call next patient (for a specific doctor)
   * Priority: Scheduled first (oldest WAITING), then Walk-ins
   */
  async callNext(doctorId) {
    await connectDB();

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // First try to find a scheduled patient waiting
    let patient = await QueueEntry.findOneAndUpdate(
      {
        doctorId,
        date: { $gte: today, $lt: tomorrow },
        queueType: "SCHEDULED",
        status: "WAITING",
      },
      {
        $set: { status: "WITH_DOCTOR", calledAt: new Date() },
        $push: {
          statusHistory: { status: "WITH_DOCTOR", timestamp: new Date(), changedBy: "staff" },
        },
      },
      { new: true, sort: { scheduledTime: 1 } }
    ).populate("patientId");

    // If no scheduled, try walk-ins
    if (!patient) {
      patient = await QueueEntry.findOneAndUpdate(
        {
          doctorId,
          date: { $gte: today, $lt: tomorrow },
          queueType: "WALK_IN",
          status: "WAITING",
        },
        {
          $set: { status: "WITH_DOCTOR", calledAt: new Date() },
          $push: {
            statusHistory: { status: "WITH_DOCTOR", timestamp: new Date(), changedBy: "staff" },
          },
        },
        { new: true, sort: { createdAt: 1 } }
      ).populate("patientId");
    }

    if (!patient) {
      throw new Error("No patients in queue");
    }

    return patient;
  },

  /**
   * Start consultation (when doctor begins with patient)
   */
  async startConsultation(queueEntryId) {
    await connectDB();

    const entry = await QueueEntry.findById(queueEntryId);
    if (!entry) throw new Error("Queue entry not found");
    if (entry.status !== "WITH_DOCTOR") {
      throw new Error("Patient must be in WITH_DOCTOR status");
    }

    entry.startedAt = new Date();
    await entry.save();

    return entry;
  },

  /**
   * Complete consultation
   */
  async completeConsultation(queueEntryId) {
    await connectDB();

    const entry = await QueueEntry.findById(queueEntryId);
    if (!entry) throw new Error("Queue entry not found");

    entry.status = "DONE";
    entry.completedAt = new Date();
    entry.statusHistory.push({
      status: "DONE",
      timestamp: new Date(),
      changedBy: "staff",
    });

    await entry.save();

    // Also update linked appointment if exists
    if (entry.appointmentId) {
      // Appointment is already marked as DONE during check-in
    }

    return entry;
  },

  /**
   * Mark as no-show (called by staff at closing)
   */
  async markNoShow(queueEntryId) {
    await connectDB();

    const entry = await QueueEntry.findById(queueEntryId);
    if (!entry) throw new Error("Queue entry not found");

    entry.status = "NO_SHOW";
    entry.statusHistory.push({
      status: "NO_SHOW",
      timestamp: new Date(),
      changedBy: "staff",
    });

    await entry.save();

    // Also update linked appointment if exists
    if (entry.appointmentId) {
      await Appointment.findByIdAndUpdate(entry.appointmentId, { status: "NO_SHOW" });
    }

    return entry;
  },

  /**
   * Get queue display data for TV
   */
  async getDisplayData(doctorId) {
    await connectDB();

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const query = doctorId
      ? { doctorId, date: { $gte: today, $lt: tomorrow } }
      : { date: { $gte: today, $lt: tomorrow } };

    const [current, upNext] = await Promise.all([
      QueueEntry.findOne({ ...query, status: "WITH_DOCTOR" })
        .populate("patientId")
        .populate("doctorId")
        .lean(),
      QueueEntry.findOne({ ...query, status: "WAITING" })
        .populate("patientId")
        .sort({ queueType: 1, scheduledTime: 1, createdAt: 1 })
        .lean(),
    ]);

    const counts = await QueueEntry.aggregate([
      { $match: { ...query } },
      { $group: { _id: "$queueType", count: { $sum: 1 } } },
    ]);

    const scheduledCount = counts.find((c) => c._id === "SCHEDULED")?.count || 0;
    const walkInCount = counts.find((c) => c._id === "WALK_IN")?.count || 0;

    return {
      current,
      upNext,
      scheduledCount,
      walkInCount,
      date: today,
    };
  },

  /**
   * Get queue entry by ID
   */
  async getQueueEntryById(id) {
    await connectDB();
    return QueueEntry.findById(id).populate("patientId").populate("doctorId").lean();
  },

  /**
   * Update queue entry status manually
   */
  async updateStatus(queueEntryId, status, changedBy = "staff") {
    await connectDB();

    const entry = await QueueEntry.findById(queueEntryId);
    if (!entry) throw new Error("Queue entry not found");

    entry.status = status;
    entry.statusHistory.push({ status, timestamp: new Date(), changedBy });

    if (status === "DONE") entry.completedAt = new Date();
    if (status === "WITH_DOCTOR") entry.calledAt = new Date();

    await entry.save();

    return entry;
  },
};
