const amqp = require('amqplib');

async function connect() {
    const connection = await amqp.connect('amqp://rabbitmq');
    const channel = await connection.createChannel();
  
    return { connection, channel };
}
  
module.exports = connect;