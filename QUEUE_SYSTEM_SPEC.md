# Clinic Queue System - Technical Specification

## Overview

A queue management system that handles both scheduled appointments and walk-in patients, with separate queues, status tracking, and analytics.

---

## Data Models

### 1. Appointment (Scheduled Visits)

```js
{
  _id: ObjectId,
  patientId: ObjectId,           // ref: Patient
  doctorId: ObjectId,             // ref: Doctor
  scheduledDate: Date,            // Date of appointment
  scheduledTime: String,          // "09:00", "09:15", "09:30" etc.
  visitReason: String,            // "Initial Visit", "Follow-up", "Lab Result Reading"
  status: String,                 // SCHEDULED | DONE | CANCELLED | NO_SHOW
  queueEntryId: ObjectId,         // ref: QueueEntry (when patient checks in)
  createdAt: Date,
  updatedAt: Date
}
```

### 2. QueueEntry (Active Queue)

```js
{
  _id: ObjectId,
  patientId: ObjectId,           // ref: Patient
  doctorId: ObjectId,             // ref: Doctor
  queueType: String,              // "SCHEDULED" | "WALK_IN"
  appointmentId: ObjectId,        // ref: Appointment (if SCHEDULED)
  visitReason: String,            // "Initial Visit", "Follow-up", "Lab Result Reading"
  status: String,                 // WAITING | WITH_DOCTOR | DONE | NO_SHOW
  statusHistory: [                // Audit trail
    {
      status: String,
      timestamp: Date,
      changedBy: String            // "system" | "staff" | doctorId
    }
  ],
  scheduledTime: String,          // Time slot for SCHEDULED
  checkedInAt: Date,              // When patient arrived
  calledAt: Date,                // When doctor called patient
  startedAt: Date,                // When consultation started
  completedAt: Date,              // When consultation ended
  date: Date,                    // The date of the queue (for daily separation)
  createdAt: Date,
  updatedAt: Date
}
```

### 3. QueueWaitlist

```js
{
  _id: ObjectId,
  patientId: ObjectId,
  doctorId: ObjectId,
  visitReason: String,
  preferredDate: Date,
  preferredTime: String,
  position: Number,               // Position in waitlist
  status: String,                // WAITING | BOOKED | EXPIRED | CANCELLED
  createdAt: Date,
  updatedAt: Date
}
```

### 4. VisitReason (Reference Data)

```js
{
  _id: ObjectId,
  name: String,                   // "Initial Visit", "Follow-up", "Lab Result Reading"
  code: String,                    // "INITIAL", "FOLLOWUP", "LAB_RESULT"
  isActive: Boolean,
  displayOrder: Number
}
```

### 5. DoctorSchedule (Configurable Time Slots)

```js
{
  _id: ObjectId,
  doctorId: ObjectId,             // ref: Doctor
  dayOfWeek: Number,              // 0=Sunday, 1=Monday, ..., 6=Saturday
  slotDuration: Number,           // in minutes (e.g., 15)
  startTime: String,              // "08:00"
  endTime: String,                // "17:00"
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

---

## Queue Display Schema (For TV)

```js
{
  date: Date,
  doctorId: ObjectId,
  doctorName: String,
  currentPatient: {
    queueNumber: String,          // "A-001" or "W-001"
    patientName: String,
    visitReason: String,
    waitingSince: Date,
    status: String
  },
  upNext: {
    queueNumber: String,
    patientName: String,
    scheduledTime: String
  },
  scheduledCount: Number,
  walkInCount: Number,
  estimatedWaitTime: Number       // in minutes
}
```

---

## API Endpoints

### Appointments

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/appointments` | List appointments (filter by date, doctor, status) |
| GET | `/api/appointments/:id` | Get single appointment |
| POST | `/api/appointments` | Create scheduled appointment |
| PATCH | `/api/appointments/:id` | Update appointment (reschedule, cancel) |
| DELETE | `/api/appointments/:id` | Cancel appointment |

### Queue

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/queue` | Get today's queue (grouped by scheduled/walk-in) |
| GET | `/api/queue/:id` | Get single queue entry |
| POST | `/api/queue/walkin` | Add walk-in patient to queue |
| POST | `/api/queue/checkin/:appointmentId` | Patient checks in for scheduled appointment |
| PATCH | `/api/queue/:id/call` | Doctor calls next patient |
| PATCH | `/api/queue/:id/start` | Start consultation |
| PATCH | `/api/queue/:id/complete` | Complete consultation |
| PATCH | `/api/queue/:id/no-show` | Mark as no-show |
| PATCH | `/api/queue/:id/status` | Update status manually |

### Waitlist

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/waitlist` | Get waitlist |
| POST | `/api/waitlist` | Add to waitlist |
| PATCH | `/api/waitlist/:id/book` | Book from waitlist when slot opens |
| DELETE | `/api/waitlist/:id` | Cancel waitlist entry |

### Queue Display

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/queue/display` | Get display data for TV (current + up next) |

### Admin

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/queue/analytics` | Get queue statistics |
| GET | `/api/doctors/:id/schedule` | Get doctor's schedule |
| PUT | `/api/doctors/:id/schedule` | Update doctor's time slots |

---

## Business Logic

### Queue Priority
1. **Scheduled appointments** always take priority over walk-ins
2. Within scheduled, order is by `scheduledTime`
3. Within walk-ins, order is FIFO (by `createdAt`)
4. Walk-ins are never mixed with scheduled in display

### Check-in Flow
```
1. Patient arrives → Staff searches for appointment
2. Staff clicks "Check In" → Appointment status = DONE
3. QueueEntry created with type = SCHEDULED
4. Patient appears in Scheduled Queue
```

### Walk-in Flow
```
1. Patient arrives → Staff creates walk-in
2. QueueEntry created with type = WALK_IN
3. Patient appears in Walk-in Queue
```

### Call Next Patient
```
1. Doctor clicks "Call Next"
2. System pulls from Scheduled queue (oldest WAITING first)
3. If Scheduled empty, pulls from Walk-in queue
4. QueueEntry status = WITH_DOCTOR
5. Queue display updates
```

### No-Show Flow
```
1. At end of day, staff reviews pending queue entries
2. Staff marks remaining WAITING entries as NO_SHOW
3. StatusHistory updated with timestamp
```

### Cancellation Flow
```
1. Patient/Staff cancels appointment
2. Appointment status = CANCELLED
3. If waitlist has entries for this doctor/date:
   - First waitlist entry gets notification
   - Staff can book them into the open slot
```

---

## Status State Machine

```
SCHEDULED (Appointment)
       ↓ check-in
WAITING (QueueEntry)
       ↓ call
WITH_DOCTOR
       ↓ complete
  DONE

WAITING ←──→ WITH_DOCTOR
    ↓ no-show
  NO_SHOW
```

---

## Visit Reasons (Default Data)

```js
[
  { name: "Initial Visit", code: "INITIAL" },
  { name: "Follow-up", code: "FOLLOWUP" },
  { name: "Lab Result Reading", code: "LAB_RESULT" }
]
```

---

## Analytics Data Points

- Average wait time per patient
- Average consultation duration per doctor
- Busiest hours/days
- Patient no-show rate
- Walk-in vs Scheduled ratio
- Visit reason distribution

---

## Future Considerations (Out of Scope for V1)

- SMS/Notification integration
- Patient self-service booking portal
- Payment integration
- Prescription management
- Multi-branch support
