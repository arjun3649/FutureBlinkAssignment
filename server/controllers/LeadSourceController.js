import LeadSource from "../models/LeadSourceModel.js";

export const createLeadSource = async (req, res) => {
  try {
    const { name, body } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Lead Source name is required' });
    }
    
    if (!body) {
      return res.status(400).json({ message: 'At least one email is required' });
    }
    
    // Create the lead source with the name and body (emails)
    const leadSource = new LeadSource({ 
      name,
      body
    });
    
    await leadSource.save();

    // Count how many emails are in the body
    const emailCount = body.split(',').filter(email => email.trim()).length;

    res.status(201).json({ 
      message: `Lead Source created successfully with ${emailCount} email${emailCount !== 1 ? 's' : ''}`, 
      leadSource 
    });
  } catch (error) {
    console.error('Error creating lead source:', error);
    res.status(500).json({ message: error.message });
  }
};

export const getLeadSources = async (req, res) => {
  try {
    const leadSources = await LeadSource.find();
    
    // Add email count to each lead source
    const leadSourcesWithCounts = leadSources.map(source => {
      const emailCount = source.body ? source.body.split(',').filter(email => email.trim()).length : 0;
      return {
        ...source.toObject(),
        emailCount
      };
    });
    
    res.status(200).json(leadSourcesWithCounts);
  } catch (error) {
    console.error('Error fetching lead sources:', error);
    res.status(500).json({ message: error.message });
  }
};
