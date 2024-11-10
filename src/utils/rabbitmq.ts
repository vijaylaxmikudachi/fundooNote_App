import amqp from 'amqplib/callback_api';

let channel: amqp.Channel;
let connection: amqp.Connection;

//conncetion for RabbitMQ server
export const connectToRabbitMQ = (): void => {
  amqp.connect('amqp://localhost', (error, conn) => {
    if (error) {
      console.error('Error connecting to RabbitMQ:', error);
      process.exit(1);
    }

    connection = conn;
    connection.createChannel((error1, ch) => {
      if (error1) {
        console.error('Error creating channel:', error1);
        process.exit(1);
      }

      channel = ch;
      console.log('RabbitMQ connected and channel created');
    });
  });
};

//Publisher function for sending message.
export const publishMessage = (queue: string, message: any): void => {
  if (!channel) {
    console.error('RabbitMQ channel not initialized');
    return;
  }

  channel.assertQueue(queue, { durable: true });
  channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)), { persistent: true });
  console.log('Message sent to queue:', message);
};
