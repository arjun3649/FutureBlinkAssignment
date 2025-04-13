import agenda from '../agenda/index.js';
import Workflow from "../models/WorkflowModel.js";


export const createWorkflow = async (req, res) => {
  try {
    const { user, name, nodes, edges, sequenceSettings } = req.body;

    const workflow = new Workflow({
      user,
      name: name || 'Untitled Campaign',
      sequence: nodes,
      edges,
      sequenceSettings,
    });

    await workflow.save();

    
    if (sequenceSettings && sequenceSettings.launchDate) {
      await agenda.cancel({ 'data.workflowId': workflow._id.toString() }); // Cancel any existing jobs
      await agenda.schedule(new Date(sequenceSettings.launchDate), 'send-sequence-emails', { workflowId: workflow._id });
      console.log(`Scheduled email sending for workflow ${workflow._id} at ${sequenceSettings.launchDate}`);
    }

    res.status(201).json(workflow);

  } catch (err) {
    console.error('Error creating workflow:', err);
    res.status(500).json({ message: err.message });
  }
};

export const getWorkflows = async (req, res) => {
  try {
    const { userId } = req.params;
    const workflows = await Workflow.find({ user: userId }).populate('sequence.data.leadSourceId').populate('sequence.data.emailTemplateId');
    res.status(200).json(workflows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getWorkflowById = async (req, res) => {
  try {
    const { workflowId } = req.params;

    const workflow = await Workflow.findById(workflowId)
      .populate('sequence.data.leadSourceId')
      .populate('sequence.data.emailTemplateId');

    if (!workflow) return res.status(404).json({ message: 'Workflow not found' });

    res.status(200).json(workflow);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const updateWorkflow = async (req, res) => {
  try {
    const { workflowId } = req.params;
    const { name, nodes, edges, sequenceSettings } = req.body;

    const workflow = await Workflow.findByIdAndUpdate(workflowId, {
      name: name || 'Untitled Campaign',
      sequence: nodes,
      edges,
      sequenceSettings,
    }, { new: true });

    if (!workflow) {
      return res.status(404).json({ message: 'Workflow not found' });
    }

    await agenda.cancel({ 'data.workflowId': workflowId });
    
    
    if (sequenceSettings && sequenceSettings.launchDate) {
      await agenda.schedule(new Date(sequenceSettings.launchDate), 'send-sequence-emails', { workflowId });
      console.log(`Rescheduled email sending for workflow ${workflowId} at ${sequenceSettings.launchDate}`);
    }

    res.status(200).json(workflow);

  } catch (err) {
    console.error('Error updating workflow:', err);
    res.status(500).json({ message: err.message });
  }
};
