import Agenda from 'agenda';
import dotenv from 'dotenv';
dotenv.config();

const agenda = new Agenda({
  db: { address: process.env.MONGODB_URI, collection: 'agendaJobs' }
});

agenda.on('ready', () => {
  console.log('Agenda started');
});

agenda.on('error', (error) => {
  console.log('Agenda connection error:', error);
});

export default agenda;
