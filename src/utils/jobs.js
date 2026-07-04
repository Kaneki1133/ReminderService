const cron = require(`node-cron`);
const emailService = require(`../service/email-service`);
const sender = require(`../config/emailConfig`);
/**
 * * Suppose a Job is for 10:00am
 * * We Will check using cron every 5 min in database
 * * We will check are their any pending emails which was expected to be sent
 * * by now and is pending 
 */


const setupJobs = () => {
    cron.schedule("*/1 * * * *" , async ()=>{
        const response = await emailService.fetchPendingEmails();
        response.forEach((email) => {
            sender.sendMail({
                from :'ReminderService@gmail.com',
                to:email.recepientEmail,
                subject:email.subject,
                text:email.content
            },async (err , data) => {
                if(err){
                    console.log("Error When sender.sendMail ", err);
                }
                else{
                    console.log(data);
                    await emailService.updateTicket(email.id , {status:"SUCCESS"});
                }
            });
        });
    });
};

module.exports = setupJobs;