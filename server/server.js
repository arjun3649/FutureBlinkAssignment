import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import helmet from 'helmet';
import agenda from './agenda/index.js';
import connectDB from './configs/db.js';
import router from './routers/Authrouter.js';
import emailTemplateRoutes from './routers/EmailTemplaterouter.js';
import leadSourceRoutes from './routers/LeadSourcerouter.js';
import workflowRoutes from './routers/Workflowrouter.js';

// Load environment variables first
dotenv.config();

// Connect to the database
console.log('Connecting to the database...');
await connectDB();
console.log('Database connection established.');

// Initialize Agenda
console.log('Initializing Agenda...');
try {
  agenda.on('ready', async () => {
    console.log('Agenda ready, starting job processing...');
    await agenda.start();
    
    // Log the number of existing jobs
    const pendingJobs = await agenda.jobs();
    console.log(`Found ${pendingJobs.length} pending email jobs in the database.`);
  });
  
  agenda.on('error', (error) => {
    console.error('Agenda error:', error);
  });
  
  // Listen for job completions
  agenda.on('complete', (job) => {
    console.log(`Job ${job.attrs.name} completed for workflow: ${job.attrs.data?.workflowId}`);
  });
  
  agenda.on('fail', (error, job) => {
    console.error(`Job ${job.attrs.name} failed for workflow: ${job.attrs.data?.workflowId}:`, error);
  });
  
  await agenda.start();
  console.log('Agenda started successfully.');
} catch (error) {
  console.error('Error starting Agenda:', error);
}

// Initialize Express app
const app = express();
const port = process.env.PORT || 4000;

const allowedOrigins = ['https://futureblink-w2ml.onrender.com']

// Middleware setup
app.use(express.json());
app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(helmet());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', router);
app.use('/api/email-templates', emailTemplateRoutes);
app.use('/api/lead-sources', leadSourceRoutes);
app.use('/api', workflowRoutes);

// Start the server
app.listen(port)
  .on('listening', () => {
    console.log(`Server is running on port ${port}`);
    console.log('Email scheduler is active and ready to process workflow emails.');
  })
  .on('error', (error) => {
    console.error('Server error:', error);
  });