import express from 'express';
import { createEmailTemplate, getEmailTemplates } from '../controllers/EmailTemplateController.js';

const router = express.Router();

router.get('/', getEmailTemplates);
router.post('/', createEmailTemplate);

export default router;
