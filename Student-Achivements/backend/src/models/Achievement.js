import mongoose from "mongoose";

const AchievementSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
  title: { type: String, required: true },
  activityType: { type: String, required: true },
  academicYear: { type: String, required: true },
  semester: { type: String, required: true },
  description: { type: String, required: true },
  certificateFileName: { type: String },
  certificateData: { type: String },
  status: { type: String, enum: ["Pending", "Verified", "Rejected"], default: "Pending" },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Achievement", AchievementSchema);
