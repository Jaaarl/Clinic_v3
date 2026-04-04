import QueueWaitlist from "@/models/queueWaitlist";
import Appointment from "@/models/appointment";
import connectDB from "@/lib/mongodb";

export const waitlistService = {
  /**
   * Add a patient to the waitlist
   */
  async addToWaitlist(data) {
    const { patientId, doctorId, visitReason, preferredDate, preferredTime } = data;

    await connectDB();

    if (!patientId || !doctorId || !visitReason || !preferredDate) {
      throw new Error("patientId, doctorId, visitReason, and preferredDate are required");
    }

    // Check if already on waitlist for this doctor/date
    const existing = await QueueWaitlist.findOne({
      patientId,
      doctorId,
      preferredDate: new Date(preferredDate),
      status: "WAITING",
    });

    if (existing) {
      throw new Error("Patient is already on the waitlist for this date");
    }

    // Get the next position
    const lastEntry = await QueueWaitlist.findOne({
      doctorId,
      preferredDate: new Date(preferredDate),
      status: "WAITING",
    }).sort({ position: -1 });

    const position = lastEntry ? lastEntry.position + 1 : 1;

    const waitlistEntry = await QueueWaitlist.create({
      patientId,
      doctorId,
      visitReason,
      preferredDate: new Date(preferredDate),
      preferredTime,
      position,
      status: "WAITING",
    });

    return waitlistEntry;
  },

  /**
   * Get waitlist for a doctor
   */
  async getWaitlist(doctorId) {
    await connectDB();

    const query = { status: "WAITING" };
    if (doctorId) query.doctorId = doctorId;

    return QueueWaitlist.find(query)
      .populate("patientId")
      .populate("doctorId")
      .sort({ preferredDate: 1, position: 1 })
      .lean();
  },

  /**
   * Book a patient from waitlist into an open slot
   */
  async bookFromWaitlist(waitlistId, appointmentData) {
    await connectDB();

    const waitlistEntry = await QueueWaitlist.findById(waitlistId);
    if (!waitlistEntry) throw new Error("Waitlist entry not found");
    if (waitlistEntry.status !== "WAITING") {
      throw new Error("Waitlist entry is not in WAITING status");
    }

    // Create the appointment
    const appointment = await Appointment.create({
      patientId: waitlistEntry.patientId,
      doctorId: appointmentData.doctorId,
      scheduledDate: appointmentData.scheduledDate,
      scheduledTime: appointmentData.scheduledTime,
      visitReason: waitlistEntry.visitReason,
      status: "SCHEDULED",
    });

    // Update waitlist entry
    waitlistEntry.status = "BOOKED";
    await waitlistEntry.save();

    return { appointment, waitlistEntry };
  },

  /**
   * Cancel waitlist entry
   */
  async cancelWaitlist(waitlistId) {
    await connectDB();

    const entry = await QueueWaitlist.findById(waitlistId);
    if (!entry) throw new Error("Waitlist entry not found");

    entry.status = "CANCELLED";
    await entry.save();

    return entry;
  },

  /**
   * Expire old waitlist entries
   */
  async expireOldEntries() {
    await connectDB();

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(0, 0, 0, 0);

    const result = await QueueWaitlist.updateMany(
      {
        preferredDate: { $lt: yesterday },
        status: "WAITING",
      },
      { $set: { status: "EXPIRED" } }
    );

    return result;
  },
};
