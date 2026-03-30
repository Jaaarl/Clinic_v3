import mongoose from "mongoose";

const ClinicInfoSchema = new mongoose.Schema({
  clinics: [
    {
      name: {
        type: String,
        default: "CLINIC_NAME",
      },
      addresses: [
        {
          label: {
            type: String,
            default: "Main",
          },
          street: {
            type: String,
            default: "CLINIC_ADDRESS",
          },
          city: {
            type: String,
            default: "",
          },
          province: {
            type: String,
            default: "",
          },
          zip: {
            type: String,
            default: "",
          },
        },
      ],
      operatingHours: [
        {
          label: {
            type: String,
            default: "Hours",
          },
          schedule: {
            type: String,
            default: "CLINIC_HOURS",
          },
        },
      ],
      phone: {
        type: String,
        default: "",
      },
      email: {
        type: String,
        default: "",
      },
    },
  ],
  isActive: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const ClinicInfo = mongoose.models.ClinicInfo || mongoose.model("ClinicInfo", ClinicInfoSchema);

export default ClinicInfo;
