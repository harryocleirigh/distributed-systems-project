const connect = require('./setup');

async function produce(queue, message) {
  const { channel, connection } = await connect();

  try {
    channel.assertQueue(queue, { durable: false });
    channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)));

    setTimeout(() => {
        connection.close();
    }, 500);
  } catch (error) {
    console.log("producer error:", error)
  }
  
}

module.exports = produce;
