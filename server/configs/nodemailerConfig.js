import nodemailer from 'nodemailer';
import dotenv from 'dotenv';


dotenv.config();

let transporter;


if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
  
  transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
  
  
  transporter.verify(function(error, success) {
    if (error) {
      console.error('SMTP connection error:', error);
    } else {
      console.log('SMTP server is ready to send messages');
    }
  });
} else {
  console.warn('Email credentials not configured. Using ethereal email for testing.');
  
  
  transporter = {
   sendMail: (mailOptions) => {
  console.log('---------------------------------------------');
  console.log('Email sending skipped - credentials not configured');
  console.log('Would have sent email with the following options:');
  console.log('From:', mailOptions.from);
  console.log('Recipients:', mailOptions.to || mailOptions.bcc);  
  console.log('Subject:', mailOptions.subject);
  console.log('Text:', mailOptions.text?.substring(0, 100) + '...');
  console.log('---------------------------------------------');
  return Promise.resolve({ messageId: 'test-message-id' });
}

  };
}

export default transporter;
