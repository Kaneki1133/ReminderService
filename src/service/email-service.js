const sender = require(`../config/emailConfig`);
const TicketRepository = require(`../repository/ticket-repository`);
const repo = new TicketRepository();

const sendBasicEmail = async (mailFrom , mailTo , mailSubject , mailBody) => {
    try {
        const response = await sender.sendMail({
            from:mailFrom,
            to:mailTo,
            subject:mailSubject,
            text:mailBody
        });
        console.log(response);
    } catch (error) {
        console.log(error);
    }
}

const fetchPendingEmails = async (timeStamp) =>{
    try {
        const response = await repo.get({status:"PENDING"});
        return response;
    } catch (error) {
        console.log(error);
    }
} 

const createTicket = async (data) =>{
    try {
        console.log(data);
        const response = await repo.create(data);
        return response;
    } catch (error) {
        console.log(error);
    }
}

const updateTicket = async (ticketId , data) =>{
    try {
        const response = await repo.update(ticketId , data);
        return response;
    } catch (error) {
        console.log("Error While Updating Ticket " ,error );
    }
}

const subscribeEvents = async (payload) =>{
    let service = payload.service;
    let data = payload.data;

    switch(service){
        case 'CREATE_TICKET':
            await createTicket(data);
            break;
        case 'SEND_BASIC_EMAIL':
            await sendBasicEmail(payload);
            break;
        default:
            console.log("No Valid Event Received");
            break;
    }

}


module.exports = {
    sendBasicEmail,
    fetchPendingEmails,
    createTicket,
    updateTicket,
    subscribeEvents
}