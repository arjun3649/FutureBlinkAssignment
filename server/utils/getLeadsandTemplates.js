import Workflow from '../models/WorkflowModel.js';

export const getLeadsAndTemplates = async (workflowId) => {
  try {
    const workflow = await Workflow.findById(workflowId)
      .populate('sequence.data.leadSourceId')
      .populate('sequence.data.emailTemplateId');

    if (!workflow) {
      console.error(`Workflow not found: ${workflowId}`);
      return { leads: [], templates: [], sequenceSettings: {}, orderedNodes: [] };
    }

    const leads = [];
    const templates = [];
    const sequenceSettings = workflow.sequenceSettings || {};
    const orderedNodes = workflow.sequence || [];  // maintain the node sequence

    // Extract leads from loadSourceNode type nodes
    orderedNodes.forEach(node => {
      if (node.type === 'loadSourceNode' && node.data?.leadSourceId?.body) {
        try {
          const emails = node.data.leadSourceId.body.split(',');
          emails.forEach(email => {
            const trimmedEmail = email.trim();
            if (trimmedEmail && trimmedEmail.includes('@')) {
              leads.push({ 
                email: trimmedEmail, 
                name: trimmedEmail.split('@')[0] 
              });
            }
          });
        } catch (error) {
          console.error('Error processing leads:', error);
        }
      }

      // Extract email templates from coldEmailNode type nodes
      if (node.type === 'coldEmailNode' && node.data?.emailTemplateId) {
        try {
          const template = {
            subject: node.data.emailTemplateId.subject || 'No Subject',
            body: node.data.emailTemplateId.body || 'No Content',
          };
          
          if (!templates.some(t => t.subject === template.subject)) {
            templates.push(template);
          }
        } catch (error) {
          console.error('Error processing email template:', error);
        }
      }
    });

    console.log(`Found ${leads.length} leads and ${templates.length} templates for workflow: ${workflowId}`);
    return { leads, templates, sequenceSettings, orderedNodes };
  } catch (error) {
    console.error(`Error in getLeadsAndTemplates: ${error.message}`);
    return { leads: [], templates: [], sequenceSettings: {}, orderedNodes: [] };
  }
};
