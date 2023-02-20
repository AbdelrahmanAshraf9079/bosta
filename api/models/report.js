import mongoose from "mongoose";

const ReportSchema = new mongoose.Schema(
  {
    status: {
      type: String,
      required: true,
    },
    availability: {
      type: String, //Need to be changed to Mixed
      required: true,
    },
    outages: {
      type: Number,
      required: true,
    },
    downtime: {
      type: Number,
      required: true,
    },
    uptime: {
      type: Number,
      required: true,
    },
    responseTime: {
      type: Number,
      required: true,
    },
    history: {
      type: [
        {
          status: String,
          responseTime: String,
          timestamp: {
            type: Date,
            default: Date.now(),
          },
        },
        { timestamps: true },
      ],
      required: true,
    },
  },
  { timestamps: true }
);

export default ReportSchema;
