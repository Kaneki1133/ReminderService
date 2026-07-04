const express = require(`express`);
const bodyParser = require(`body-parser`);
const { PORT } = require(`./config/serverConfig`);

const sendBasicEmail = require(`./service/email-service`);

const setupAndStartServer = async () =>{
    const app = express();
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: true}));

    app.listen(PORT , async ()=>{
        console.log(`Server has Started on ${PORT}`);
        
        sendBasicEmail(
            'support@admin.com',
            'srishtitripathi2202@gmail.com',
            'this is a testing mail',
            'hey how are you i hope you doing great'
        );

    });
}

setupAndStartServer();