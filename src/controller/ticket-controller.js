const emailService = require(`../service/email-service`);

const create = async (req , res) =>{
    try {
        const response = await emailService.createTicket(req.body);
        return res.status(200).json({
            success:true,
            message:"SuccessFully Created a Notification Ticket",
            data:response,
            err:{}
        });
    } catch (error) {
        console.log(error);
        return res.status(201).json({
            success:false,
            message:"Unable to Created a Notification Ticket",
            data:{},
            err:error
        });
    }
}

module.exports = {
    create,
}