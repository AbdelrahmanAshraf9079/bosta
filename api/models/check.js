import mongoose from "mongoose";
import report from "./report.js";

const CheckSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  path: {
    type: String,
  },
  port: {
    type: Number,
  },
  webhook: {
    type: String,
  },
  timeout: {
    type: Number,
    default: 5000, // defaults to 5 seconds (5000ms)
  },
  interval: {
    type: Number,
    default: 600000, // defaults to 10 minutes (600000ms)
  },
  threshold: {
    type: Number,

    default: 1, // defaults to 1 failure
  },
  authentication: {
    type: String,
  },
  httpHeaders: {
    type: [String],
  },
  assert: {
    type: Number,
  },
  tags: {
    type: [Number],
  },
  ignoreSSL: {
    type: Boolean,
  },
  report: report
});

export default mongoose.model("Check",CheckSchema)