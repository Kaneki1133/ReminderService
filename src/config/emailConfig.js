const nodemailer = require(`nodemailer`);

const { GOOGLE_CLIENT_ID , GOOGLE_CLIENT_SECRET , GOOGLE_REFRESH_TOKEN } = require(`./serverConfig`)

const sender = nodemailer.createTransport({
    service:"gmail",
    auth: {
        type:"OAuth2",
        user:"shlokdev1133@gmail.com",
        clientId: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET ,
        refreshToken: GOOGLE_REFRESH_TOKEN ,
    },
});

module.exports = sender;