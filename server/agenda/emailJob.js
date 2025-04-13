import transporter from '../configs/nodemailerConfig.js';
import { getLeadsAndTemplates } from '../utils/getLeadsandTemplates.js';
import { sleep, isWithinSendingHours, applyRandomDelay, convertTo24Hr } from '../utils/emailHelpers.js';

// Maximum number of emails to send in a batch (to avoid rate limiting)
const MAX_BATCH_SIZE = 10;
// Delay between batches in milliseconds (to avoid rate limiting)
const BATCH_DELAY_MS = 60 * 1000; // 1 minute

export const emailJob = (agenda) => {
  agenda.define('send-sequence-emails', async (job) => {
    try {
      const { workflowId } = job.attrs.data;
      console.log(`Starting email job for workflow: ${workflowId}`);
      
      const { leads, templates, sequenceSettings, orderedNodes } = await getLeadsAndTemplates(workflowId);

      if (!leads || leads.length === 0) {
        console.log('No leads found for this workflow. Exiting job.');
        return;
      }

      console.log(`Found ${leads.length} leads to process`);

      // Remove sending mode option and always use batch mode
      console.log(`Using email sending mode: batch (default)`);

      // If sequence settings don't exist, use default values
      const { 
        launchDate = new Date(), 
        launchTime = '9:00 AM', 
        randomDelays = { enabled: false, fromMinutes: 1, toMinutes: 5 }, 
        sendingHours = [] 
      } = sequenceSettings || {};

      // Calculate start time
      let startDateTime;
      try {
        startDateTime = new Date(`${new Date(launchDate).toISOString().split('T')[0]}T${convertTo24Hr(launchTime)}`);
      } catch (error) {
        console.error('Error parsing launch date/time:', error);
        startDateTime = new Date(); // Default to now if there's a parsing error
      }

      const now = new Date();

      if (now < startDateTime) {
        const waitMs = startDateTime - now;
        console.log(`Waiting until launch time → ${startDateTime.toISOString()}`);
        await sleep(waitMs);
      }

      // Process email sending based on the nodes
      for (const node of orderedNodes) {
        if (!node || !node.type) {
          console.log('Skipping invalid node');
          continue;
        }

        if (node.type === 'coldEmailNode' && node.data?.emailTemplateId) {
          const template = templates.find(t => t.subject === node.data.emailTemplateId.subject);
          
          if (!template) {
            console.log(`No matching template found for node: ${node.id}`);
            continue;
          }

          // Wait until correct sending hour if sending hours are defined
          if (sendingHours && sendingHours.length > 0) {
            let withinHours = false;
            while (!withinHours) {
              withinHours = isWithinSendingHours(sendingHours);
              if (!withinHours) {
                console.log('Outside sending hours...waiting 5 minutes');
                await sleep(5 * 60 * 1000); // Wait 5 minutes before checking again
              }
            }
          }

          // Always use batch mode
          await sendBatchEmails(leads, template, randomDelays);
        } else if (node.type === 'delayNode' && node.data?.waitFor && node.data?.waitType) {
          const waitFor = parseInt(node.data.waitFor, 10) || 0;
          const waitType = (node.data.waitType || '').toLowerCase();

          const delayMs =
            waitType === 'minutes' ? waitFor * 60 * 1000 :
              waitType === 'hours' ? waitFor * 60 * 60 * 1000 :
                waitType === 'days' ? waitFor * 24 * 60 * 60 * 1000 :
                  0;

          console.log(`Adding node delay for ${waitFor} ${waitType}: ${delayMs/1000} seconds`);
          await sleep(delayMs);
        }
      }

      console.log(`Email campaign completed for workflow: ${workflowId}`);
    } catch (error) {
      console.error('Error in send-sequence-emails job:', error);
    }
  });
};

// We'll keep this function for reference but it won't be used anymore
async function sendIndividualEmails(leads, template, randomDelays) {
  console.log(`Sending personalized emails to ${leads.length} recipients`);
  
  for (const lead of leads) {
    if (!lead.email) {
      console.log('Skipping lead with no email');
      continue;
    }
    
    console.log(`Processing lead: ${lead.email}`);
    
    try {
      // Replace any personalization variables in template
      const personalizedText = template.body.replace(/\{\{name\}\}/g, lead.name || 'there');
      const personalizedHtml = template.body.replace(/\{\{name\}\}/g, lead.name || 'there');
      
      await transporter.sendMail({
        from: '"Future Blink" <no-reply@futureblink.io>',
        to: lead.email,
        subject: template.subject,
        text: personalizedText,
        html: personalizedHtml,
      });
      console.log(`Email sent successfully to ${lead.email}`);
    } catch (error) {
      console.error(`Error sending email to ${lead.email}:`, error);
    }

    // Add random delay if enabled
    if (randomDelays && randomDelays.enabled) {
      const fromMin = randomDelays.fromMinutes || 1;
      const toMin = randomDelays.toMinutes || 5;
      const randomDelayMs = applyRandomDelay(fromMin, toMin);
      console.log(`Adding random delay of ${randomDelayMs / 1000} seconds`);
      await sleep(randomDelayMs);
    }
  }
}

/**
 * Send emails in batches using BCC for efficiency
 */
async function sendBatchEmails(leads, template, randomDelays) {
  if (!leads || leads.length === 0) return;
  
  console.log(`Sending batch emails to ${leads.length} recipients`);
  
  // Split recipients into batches
  const batches = [];
  for (let i = 0; i < leads.length; i += MAX_BATCH_SIZE) {
    batches.push(leads.slice(i, i + MAX_BATCH_SIZE));
  }
  
  console.log(`Split into ${batches.length} batches of maximum ${MAX_BATCH_SIZE} recipients`);
  
  for (let i = 0; i < batches.length; i++) {
    const batch = batches[i];
    console.log(`Processing batch ${i+1}/${batches.length} with ${batch.length} recipients`);
    
    try {
      // Get valid emails from the batch - fix for the issue where second email wasn't receiving
      const validEmails = batch
        .filter(lead => lead && lead.email && typeof lead.email === 'string' && lead.email.includes('@'))
        .map(lead => lead.email.trim());
      
      if (validEmails.length === 0) {
        console.log('No valid emails in this batch, skipping');
        continue;
      }
      
      console.log(`Valid emails for batch ${i+1}:`, validEmails);
      
      // Send email with all recipients in BCC
      await transporter.sendMail({
        from: '"Future Blink" <no-reply@futureblink.io>',
        bcc: validEmails.join(','),
        subject: template.subject,
        text: template.body.replace(/\{\{name\}\}/g, 'there'),
        html: template.body.replace(/\{\{name\}\}/g, 'there'),
      });
      
      console.log(`Batch email sent successfully to ${validEmails.length} recipients`);
    } catch (error) {
      console.error(`Error sending batch email:`, error);
    }
    
    // Add delay between batches to avoid rate limiting
    if (i < batches.length - 1) {
      console.log(`Waiting ${BATCH_DELAY_MS/1000} seconds before sending next batch...`);
      await sleep(BATCH_DELAY_MS);
    }
    
    // Add additional random delay if enabled
    if (randomDelays && randomDelays.enabled) {
      const randomDelayMs = applyRandomDelay(
        randomDelays.fromMinutes || 1, 
        randomDelays.toMinutes || 5
      );
      console.log(`Adding random delay of ${randomDelayMs/1000} seconds`);
      await sleep(randomDelayMs);
    }
  }
}

