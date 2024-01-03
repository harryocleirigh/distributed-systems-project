/// Consumer for RabbitMQ

const connect = require('./setup');

/**
 * Consumer function responsible for handling recieved messages to a given queue
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
      }
    },
    { noAck: true }
  );
  } catch (error) {
    console.log("consumer error:", error)
  }
}

module.exports = consume;

