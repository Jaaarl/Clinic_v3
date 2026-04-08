import DoctorSchedule from "@/models/doctorSchedule";
import connectDB from "@/lib/mongodb";

export const doctorScheduleService = {
  /**
   * Get schedule for a doctor
   */
  async getSchedule(doctorId) {
    await connectDB();
    return DoctorSchedule.find({ doctorId, isActive: true })
      .sort({ dayOfWeek: 1 })
      .lean();
  },

  /**
   * Get schedule for a specific day
   */
  async getScheduleForDay(doctorId, dayOfWeek) {
    await connectDB();
    return DoctorSchedule.findOne({ doctorId, dayOfWeek, isActive: true }).lean();
  },

  /**
   * Update or create schedule for a doctor
   */
  async upsertSchedule(doctorId, schedules) {
    await connectDB();

    // schedules is an array of { dayOfWeek, slotDuration, startTime, endTime }
    const results = [];

    for (const schedule of schedules) {
      const existing = await DoctorSchedule.findOne({
        doctorId,
        dayOfWeek: schedule.dayOfWeek,
      });

      if (existing) {
        Object.assign(existing, {
          slotDuration: schedule.slotDuration,
          startTime: schedule.startTime,
          endTime: schedule.endTime,
          isActive: schedule.isActive !== false,
        });
        await existing.save();
        results.push(existing);
      } else {
        const newSchedule = await DoctorSchedule.create({
          doctorId,
          dayOfWeek: schedule.dayOfWeek,
          slotDuration: schedule.slotDuration,
          startTime: schedule.startTime,
          endTime: schedule.endTime,
          isActive: true,
        });
        results.push(newSchedule);
      }
    }

    return results;
  },

  /**
   * Delete schedule for a specific day
   */
  async deleteSchedule(doctorId, dayOfWeek) {
    await connectDB();
    return DoctorSchedule.findOneAndUpdate(
      { doctorId, dayOfWeek },
      { isActive: false }
    );
  },

  /**
   * Generate time slots for a doctor on a specific date
   */
  async generateTimeSlots(doctorId, date) {
    await connectDB();

    const dayOfWeek = new Date(date).getDay();
    const schedule = await DoctorSchedule.findOne({ doctorId, dayOfWeek, isActive: true });

    if (!schedule) {
      return []; // Doctor not available on this day
    }

    const slots = [];
    let currentTime = schedule.startTime;
    const endTime = schedule.endTime;

    while (currentTime < endTime) {
      slots.push(currentTime);

      // Add slotDuration minutes to currentTime
      const [hours, minutes] = currentTime.split(":").map(Number);
      const totalMinutes = hours * 60 + minutes + schedule.slotDuration;
      const newHours = Math.floor(totalMinutes / 60);
      const newMinutes = totalMinutes % 60;
      currentTime = `${String(newHours).padStart(2, "0")}:${String(newMinutes).padStart(2, "0")}`;
    }

    return slots;
  },

  /**
   * Get available slots for a doctor on a specific date
   */
  async getAvailableSlots(doctorId, date) {
    await connectDB();

    const Appointment = (await import("@/models/appointment")).default;

    const allSlots = await this.generateTimeSlots(doctorId, date);
    if (allSlots.length === 0) return [];

    const bookedAppointments = await Appointment.find({
      doctorId,
      scheduledDate: new Date(date),
      status: { $ne: "CANCELLED" },
    }).select("scheduledTime");

    const bookedSlots = bookedAppointments.map((a) => a.scheduledTime);

    return allSlots.filter((slot) => !bookedSlots.includes(slot));
  },
};
