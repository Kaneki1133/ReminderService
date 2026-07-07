const express = require(`express`);
const bodyParser = require(`body-parser`);
const { PORT , REMINDER_BINDING_KEY} = require(`./config/serverConfig`);
const TicketController = require(`./controller/ticket-controller`);

const EmailServices = require(`./service/email-service`);
const { createChannel , subscribeMessage } = require(`./utils/messageQueue`);

const jobs = require(`./utils/jobs`);


const setupAndStartServer = async () => {
    const app = express();
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: true}));
 
    app.post('/api/v1/tickets',TicketController.create);
    
    app.get('/api/v1/info' , (req,res) =>{
        console.log("Info from the Reminder Service");
        return res.json({message:"Info from Reminder Service"})
    })
    
    const channel = await createChannel();
    subscribeMessage(channel , EmailServices.subscribeEvents , REMINDER_BINDING_KEY);
    
    app.listen(PORT , async ()=>{
        console.log(`Server has Started on ${PORT}`);
        //console.log("STARTING OF CRON JOBS")
        //jobs();
    });

}

setupAndStartServer();



// after requiring sendBasicEmail
        // sendBasicEmail(
        //     'support@admin.com',
        //     'asdad@gmail.com',
        //     'this is a testing mail',
        //     'hey how are you i hope you doing great'
        // );
