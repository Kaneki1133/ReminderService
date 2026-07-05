const amqplib = require(`amqplib`);

const { EXCHANGE_NAME , MESSAGE_BROKER_URL } = require(`../config/serverConfig`);

const createChannel = async () => {
    try {
        const connection = await amqplib.connect(MESSAGE_BROKER_URL);
        const channel = await connection.createChannel();

        //? assertExchange() : Create the distribution center
        await channel.assertExchange(EXCHANGE_NAME, 'direct', false);

        return channel;
    } catch (error) {
        throw error;
    }
}

const subscribeMessage = async (channel , service , binding_key) => {
    try {

    //? assertQueue() : Create a warehouse/storage queue
    const applicationQueue = await channel.assertQueue('QUEUE_NAME');              

    //? bindQueue() : Connect the warehouse to the distribution center with a routing rule
    channel.bindQueue(applicationQueue.queue, EXCHANGE_NAME , binding_key);         

    channel.consume(applicationQueue.queue , msg => {
        console.log('Received Data');
        console.log(msg.content.toString());
        channel.ack(msg);
    })
    } catch (error) {
        
    }
};


const publishMessage = async (channel , binding_key , message) => {
    try {
        await channel.assertQueue(QUEUE_NAME);
        await channel.publish(EXCHANGE_NAME , binding_key , Buffer.from(message));
    } catch (error) {
        throw error;
    }
}

module.exports = {
    createChannel,
    subscribeMessage,
    publishMessage
}

/**
 * 
 * * So here     [ Publisher ]  ----> Exchange Distributor(BROKER)  ----> [Subscriber]
 * 
 * *    Whenever Exchange Distributor Receive message from Publisher, it checks that to which Queue it has to send the message,
 * *    it's job is simply to decide which queue(s) should receive the message.
 *       
 * *    Now Based on What message we have ad in which Queue we have to redirect the message it, depends on a binding_key 
 * *    Which is binded to a Queue 
 * 
 * !      RabbitMQ Concept	                     Real-world analogy
 *?       Publisher	                ---->        Person sending parcels
 *?       Exchange	                ---->        Distribution center / sorting office
 *?       Queue	                    ---->        Warehouse or storage line
 *?       Subscriber (Consumer)     ---->        Delivery person collecting parcels
 *?       Routing Key               ---->        Address label placed by the sender
 *?       Binding Key	            ---->        Rule configured on a warehouse for what it accepts
 *?       assertExchange()          ---->        Create the distribution center
 *?       assertQueue()	            ---->        Create a warehouse/storage queue
 *?       bindQueue()	            ---->        Connect the warehouse to the distribution center with a routing rule
 *?       publish()	                ---->        Send a parcel to the distribution center
 * 
 */