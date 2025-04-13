import mongoose from "mongoose";

const LeadSourceSchema = new mongoose.Schema({
  name: { type: String, required: true },   
  
  body: { type: String, required: true }, // Store emails as a comma-separated string

  createdAt: { type: Date, default: Date.now },
});

const LeadSource = mongoose.model("LeadSource", LeadSourceSchema);
export default LeadSource;
