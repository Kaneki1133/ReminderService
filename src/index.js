const express = require(`express`);
const bodyParser = require(`body-parser`);
const { PORT } = require(`./config/serverConfig`);

const sendBasicEmail = require(`./service/email-service`);

const jobs = require(`./utils/jobs`);
const TicketController = require(`./controller/ticket-controller`);

const setupAndStartServer = async () =>{
    const app = express();
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: true}));

    app.post('/api/v1/tickets',TicketController.create);

    app.listen(PORT , async ()=>{
        console.log(`Server has Started on ${PORT}`);
        console.log("STARTING OF CRON JOBS")
        jobs();
        // sendBasicEmail(
        //     'support@admin.com',
        //     'srishtitripathi2202@gmail.com',
        //     'this is a testing mail',
        //     'hey how are you i hope you doing great'
        // );

    });
}

setupAndStartServer();