/// Configuration of the RabbitMQ Connection
/// Uses the amqplib to facilitate use of messaging AMQ protocol

const amqp = require('amqplib');

/**
 * Function to connect to the RabbitMQ Server
 * @returns connection and channel
 */
async function connect() {
    const connection = await amqp.connect('amqp://rabbitmq');
    const channel = await connection.createChannel();
  
    return { connection, channel };
}
  
module.exports = connect;