import express from 'express';
import { createLeadSource, getLeadSources } from '../controllers/LeadSourceController.js';

const router = express.Router();

router.get('/', getLeadSources);
router.post('/', createLeadSource);

export default router;
