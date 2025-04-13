import express from 'express';
import {
  createWorkflow,
  getAllWorkflows,
  getWorkflow,
  updateWorkflow,
  deleteWorkflow,
} from '../controllers/workflow.controller.js';

const router = express.Router();

router
  .route('/:userId/workflows')
  .get(getAllWorkflows)
  .post(createWorkflow);

router
  .route('/:userId/workflows/:workflowId')
  .get(getWorkflow)
  .put(updateWorkflow)
  .delete(deleteWorkflow);

export default router;
