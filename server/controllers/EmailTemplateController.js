import EmailTemplate from "../models/EmailTemplateModel.js";

export const createEmailTemplate = async (req, res) => {
  try {
   

   const { name, subject, body } = req.body;

if (!name || !subject || !body) {
  return res.status(400).json({ message: 'All fields are required' });
}


    const emailTemplate = new EmailTemplate({ name, subject, body });
    await emailTemplate.save();

    res.status(201).json({ message: 'Email Template created successfully', emailTemplate });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getEmailTemplates = async (req, res) => {
  try {
    const emailTemplates = await EmailTemplate.find();
    res.status(200).json(emailTemplates);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
