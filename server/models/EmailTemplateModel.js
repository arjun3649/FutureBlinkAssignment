import mongoose from "mongoose";

const EmailTemplateSchema = new mongoose.Schema({
    id: String, 
  name: { type: String, required: true },  
  subject: { type: String, required: true },  
  body: { type: String, required: true },  
  
  createdAt: { type: Date, default: Date.now },
});

const EmailTemplate = mongoose.model('EmailTemplate', EmailTemplateSchema);
export default EmailTemplate;
