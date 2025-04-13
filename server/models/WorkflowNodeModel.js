import mongoose from 'mongoose';
const WorkflowNodeSchema = new mongoose.Schema({
  id: { type: String, required: true },

  type: { 
    type: String, 
    enum: ['loadSourceNode', 'coldEmailNode', 'delayNode', 'addButton'],
    required: true 
  },

  data: {
    label: { type: String, required: true },  

    leadSourceId: { type: mongoose.Schema.Types.ObjectId, ref: 'LeadSource' },  
    emailTemplateId: { type: mongoose.Schema.Types.ObjectId, ref: 'EmailTemplate' }, 
    waitFor: String,   
    waitType: String   
  },

  position: {
    x: { type: Number, required: false, default: 0 },
    y: { type: Number, required: false, default: 0 },
  },

  measured: {
    width: { type: Number, required: false, default: 200 },
    height: { type: Number, required: false, default: 100 },
  },
});

export default WorkflowNodeSchema;
