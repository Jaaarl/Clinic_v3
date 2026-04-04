import Appointment from "@/models/appointment";
import QueueEntry from "@/models/queueEntry";
import QueueWaitlist from "@/models/queueWaitlist";
import connectDB from "@/lib/mongodb";

export const appointmentService = {
  /**
   * Create a new scheduled appointment
   */
  async createAppointment(data) {
    const { patientId, doctorId, scheduledDate, scheduledTime, visitReason } = data;

    await connectDB();

    // Validate required fields
    if (!patientId || !doctorId || !scheduledDate || !scheduledTime || !visitReason) {
      throw new Error("All fields are required: patientId, doctorId, scheduledDate, scheduledTime, visitReason");
    }

    const appointment = await Appointment.create({
      patientId,
      doctorId,
      scheduledDate: new Date(scheduledDate),
      scheduledTime,
      visitReason,
      status: "SCHEDULED",
    });

    return appointment;
  },

  /**
   * Get appointments by date and/or doctor
   */
  async getAppointments(filters = {}) {
    const { date, doctorId, status, page = 1, limit = 50 } = filters;
    await connectDB();

    const query = {};
    if (date) query.scheduledDate = new Date(date);
    if (doctorId) query.doctorId = doctorId;
    if (status) query.status = status;

    const skip = (page - 1) * limit;

    const [appointments, total] = await Promise.all([
      Appointment.find(query)
        .populate("patientId")
        .populate("doctorId")
        .sort({ scheduledDate: 1, scheduledTime: 1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Appointment.countDocuments(query),
    ]);

    return {
      appointments,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  },

  /**
   * Check in a patient for their scheduled appointment
   * Creates a QueueEntry and updates Appointment status
   */
  async checkIn(appointmentId) {
    await connectDB();

    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) throw new Error("Appointment not found");
    if (appointment.status !== "SCHEDULED") throw new Error("Appointment is not in SCHEDULED status");

    // Check if already checked in
    if (appointment.queueEntryId) {
      throw new Error("Patient already checked in");
    }

    // Create queue entry
    const queueEntry = await QueueEntry.create({
      patientId: appointment.patientId,
      doctorId: appointment.doctorId,
      queueType: "SCHEDULED",
      appointmentId: appointment._id,
      visitReason: appointment.visitReason,
      status: "WAITING",
      scheduledTime: appointment.scheduledTime,
      date: new Date(),
      checkedInAt: new Date(),
      statusHistory: [{ status: "WAITING", timestamp: new Date(), changedBy: "staff" }],
    });

    // Update appointment
    appointment.status = "DONE";
    appointment.queueEntryId = queueEntry._id;
    await appointment.save();

    // Check waitlist and notify if applicable
    await this.processWaitlist(appointment.doctorId, appointment.scheduledDate);

    return queueEntry;
  },

  /**
   * Cancel an appointment
   */
  async cancelAppointment(appointmentId) {
    await connectDB();

    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) throw new Error("Appointment not found");
    if (appointment.status === "DONE") throw new Error("Cannot cancel a completed appointment");

    appointment.status = "CANCELLED";
    await appointment.save();

    // Process waitlist to fill the slot
    await this.processWaitlist(appointment.doctorId, appointment.scheduledDate);

    return appointment;
  },

  /**
   * Mark appointment as no-show
   */
  async markNoShow(appointmentId) {
    await connectDB();

    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) throw new Error("Appointment not found");

    appointment.status = "NO_SHOW";
    await appointment.save();

    return appointment;
  },

  /**
   * Process waitlist when a slot opens up
   */
  async processWaitlist(doctorId, date) {
    const waitlistEntry = await QueueWaitlist.findOne({
      doctorId,
      preferredDate: date,
      status: "WAITING",
    }).sort({ position: 1 });

    if (waitlistEntry) {
      // Mark as booked - staff needs to contact patient
      waitlistEntry.status = "BOOKED";
      await waitlistEntry.save();
    }
  },

  /**
   * Get appointment by ID
   */
  async getAppointmentById(id) {
    await connectDB();
    return Appointment.findById(id).populate("patientId").populate("doctorId").lean();
  },

  /**
   * Update appointment (reschedule)
   */
  async updateAppointment(id, data) {
    await connectDB();

    const appointment = await Appointment.findById(id);
    if (!appointment) throw new Error("Appointment not found");
    if (appointment.status === "DONE" || appointment.status === "CANCELLED") {
      throw new Error("Cannot update a completed or cancelled appointment");
    }

    // If rescheduling, check slot availability
    if (data.scheduledDate || data.scheduledTime) {
      const existing = await Appointment.findOne({
        doctorId: data.doctorId || appointment.doctorId,
        scheduledDate: data.scheduledDate || appointment.scheduledDate,
        scheduledTime: data.scheduledTime || appointment.scheduledTime,
        status: { $ne: "CANCELLED" },
        _id: { $ne: id },
      });

      if (existing) {
        throw new Error("This time slot is already booked");
      }
    }

    Object.assign(appointment, data);
    await appointment.save();

    return appointment;
  },
};
