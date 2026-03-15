import mongoose from "mongoose";

const DocumentSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
  docType: { type: String, required: true },
  fileName: { type: String, required: true },
  fileData: { type: String },
  uploadedAt: { type: Date, default: Date.now },
});

export default mongoose.model("Document", DocumentSchema);
