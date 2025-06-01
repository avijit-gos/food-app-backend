/** @format */

import { Kafka } from "kafkajs";

export const kafka = new Kafka({
  brokers: ["localhost:9092"],
  clientId: "food-app",
});

export const kafkaInit = async () => {
  const admin = kafka.admin();
  try {
    await admin.connect();
    console.log("Kafka admin connected");
  } catch (error) {
    console.log("Kafka admin is not connected");
    await admin.disconnect();
  }
};
