const dotenv = require(`dotenv`);

dotenv.config();

module.exports = {
    PORT: process.env.PORT,
    GOOGLE_CLIENT_ID:process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET:process.env.GOOGLE_CLIENT_SECRET,
    GOOGLE_REFRESH_TOKEN:process.env.GOOGLE_REFRESH_TOKEN,
    EXCHANGE_NAME:process.env.EXCHANGE_NAME,
    REMINDER_BINDING_KEY:process.env.REMINDER_BINDING_KEY,
    MESSAGE_BROKER_URL:process.env.MESSAGE_BROKER_URL,
};