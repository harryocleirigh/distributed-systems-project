/// Consumer for RabbitMQ

const connect = require('./setup');

/**
 * Consumer function responsible for handling recieved messages to a given queue
 * This consumer deletes itself from the server after it has finished handling a message
 * @param {*} queue 
 * @param {*} callback 
 */
async function consume(queue, callback) {
  const { channel, connection } = await connect();

  try {
    channel.assertQueue(queue, { durable: false });

  console.log(`Waiting for messages from ${queue}`);

  channel.consume(
    queue,
    (message) => {
      if (message) {
        callback(message);
        
        channel.close() // delete the queue after callback
      }
    },
    { noAck: true }
  );
  } catch (error) {
    console.log("consumer error:", error)
  }
}

module.exports = consume;
