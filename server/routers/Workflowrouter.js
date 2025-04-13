import express from "express";
import { createWorkflow, getWorkflows, getWorkflowById, updateWorkflow } from "../controllers/WorkFlowController.js";

const router = express.Router();

router.post('/users/:userId/workflows', createWorkflow);
router.get('/users/:userId/workflows', getWorkflows);
router.get('/users/:userId/workflows/:workflowId', getWorkflowById);
router.put('/users/:userId/workflows/:workflowId', updateWorkflow);

export default router;
