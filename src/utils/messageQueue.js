const amqplib = require(`amqplib`);

const { EXCHANGE_NAME , MESSAGE_BROKER_URL } = require(`../config/serverConfig`);
//const EmailServices = require(`../service/email-service`);

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
    const applicationQueue = await channel.assertQueue('Reminder_Queue');              

    //? bindQueue() : Connect the warehouse to the distribution center with a routing rule
    channel.bindQueue(applicationQueue.queue, EXCHANGE_NAME , binding_key);         

    channel.consume(applicationQueue.queue , msg => {
        console.log('Received Data');
        console.log("The msg content looks like this " , msg.content.toString());
        const payload = JSON.parse(msg.content.toString());

        service(payload);
        channel.ack(msg);
    })
    } catch (error) {
        throw error;
    }
};


const publishMessage = async (channel , binding_key , message) => {
    try {
        await channel.assertQueue('Reminder_Queue');
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
 * ! ExchangeName is the name of the Distributor 
 * ! Here Our Message Broker is RabbitMq so our MessageBrokerUrl is that of RabbitMq
 * 
 * 
 * *  When We Have to create a createChannel we dont have to pass any arguments 
 * 
 **          ---> we will amqplib library and connect to our MessageBrokerURL using amqplib.connect(MessageBrokerURL) 
 **               this connect function will return you a connection object

 **          ---> In That connection object we can call the createChannel() function which will actually create a channel
**                this channel object is going to be the object using which we will be actually communicating 
**                with our message broker

 **          ---> now we use assertExchange() on channel object like channel.assertExchange(EXCHANGE_NAME) , 
**                so this assertExchange() will make the channel object only use Exchange from the EXCHANGE_NAME given that is our Distributor Name
 **          
**           ---> then return the channel
 * 
 * 
 **   When We Have to publishMessage we have to pass arguments like (channel , binding_key , message) channel to communicate 
 **   with message broker, binding_key to tell which queue to send the message , message is what message we want to send
 * 
 **         ----> here with the channel we will use .assertQueue('Reminder_Queue') so if the queue with name Reminder_Queue is not present
**                it will create it otherwise it will not create it as already there

 **         ----> now after that we use channel.publish() where we mention 
**                     i) from what exchangeName we want to publish the message
**                    ii) what is the binding_key so that we can know which queue to publish in 
**                   iii) and what message you want to publish :- the messages are published in binaryData form 
**                        so we have to use the function Buffer.from(message)


* *  When We Have to subscribeMessage we have to pass arguments like (channel , service , binding_key) channel to communicate
**   with message broker , binding_key to tell which queue to send the message , 
**   the service here is important now as we are proactively fetching messages from the queue no body is hitting our controller so to redirect it to the service we 
**   we use this service argument 

 **         ----> first we create applicationQueue with channel.assertQueue('Reminder_Queue') to create a reminderQueue if not present

**          ----> now we will use .bindQueue() on channel with arguments like (applicationQueue , EXCHANGE_NAME , binding_key)     
**
**          ----> then we will call the .consume() on channel this consume() will take out messages one by one from the queue then 
**                a callback with console.log of received data , then msg.content.toString() then we send an ACK back with channel.ack(msg);
 */     