import mongoose from 'mongoose';
import WorkflowNodeSchema from './WorkflowNodeModel.js';

const workflowSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  
  name: {
    type: String,
    default: 'Untitled Campaign'
  },

  sequence: [WorkflowNodeSchema],  

  edges: [
    {
      id: String,
      source: String,
      target: String,
    }
  ],

  sequenceSettings: {
    launchDate: Date,
    launchTime: String,
    timezone: String,
    sendingMode: {
      type: String,
      enum: ['individual', 'batch'],
      default: 'batch'
    },
    randomDelays: {
      enabled: Boolean,
      fromMinutes: Number,
      toMinutes: Number,
    },
    sendingHours: [
      {
        day: String,        
        enabled: Boolean,
        fromTime: String,
        toTime: String,
        sendsPerDay: Number,
      }
    ]
  }

}, { timestamps: true });


const Workflow = mongoose.model('Workflow', workflowSchema);

export default Workflow;
