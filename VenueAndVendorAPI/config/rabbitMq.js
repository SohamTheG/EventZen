const amqp = require('amqplib');
// 1. IMPORT YOUR SEQUELIZE MODEL (Adjust the path if your models folder is somewhere else)
const Venue = require('../models/venue');
const { redisClient } = require('./redis');

async function connectToRabbitMQ() {
    try {
        const connection = await amqp.connect('amqp://myuser:mypassword@rabbitmq-broker:5672');
        const channel = await connection.createChannel();
        const queueName = 'venue-booking-queue';

        await channel.assertQueue(queueName, { durable: true });
        console.log(`🎧 Venue Service listening for messages on ${queueName}...`);

        // 2. MAKE THIS CALLBACK ASYNC so we can use await with Sequelize
        channel.consume(queueName, async (msg) => {
            if (msg !== null) {
                const payload = JSON.parse(msg.content.toString());

                console.log("\n========================================");
                console.log("🚨 RABBITMQ MESSAGE RECEIVED IN NODE.JS! 🚨");
                console.log("Payload:", payload);
                console.log("========================================\n");

                try {
                    // 3. THE MAGIC: Extract the exact key sent by Java (venueId)
                    const targetVenueId = payload.venueId;

                    if (targetVenueId) {
                        // 4. Update the database using Sequelize
                        await Venue.update(
                            { is_available: false }, // Set your new column to false
                            { where: { id: targetVenueId } }
                        );
                        await redisClient.del('venues:all');
                        console.log(`✅ SUCCESS: Venue ${targetVenueId} marked as unavailable in the database.`);
                    } else {
                        console.log("⚠️ WARNING: Payload did not contain a venueId.");
                    }

                    // 5. Tell RabbitMQ the job is done
                    channel.ack(msg);

                } catch (dbError) {
                    console.error("❌ Database Update Failed:", dbError);
                    // If the database fails, we DO NOT ack() the message. 
                    // We let RabbitMQ hold it so we don't lose the data.
                }
            }
        });

    } catch (error) {
        console.error("❌ RabbitMQ Connection Error:", error.message);
        setTimeout(connectToRabbitMQ, 5000);
    }
}

module.exports = connectToRabbitMQ;