/** @format */

import winston, { format, transports, Logger } from "winston";
import { KafkaTransport } from "./KafkaTransport"; // Make sure this path is correct

const customFormat = format.combine(
  format.timestamp(),
  format.printf(({ timestamp, level, message }) => {
    return JSON.stringify({
      message,
      timestamp,
      status: level,
    });
  })
);

// Define the logger
const logger: Logger = winston.createLogger({
  level: "info",
  format: customFormat,
  transports: [
    new transports.Console(),
    new KafkaTransport({
      topic: "logs_topic",
      partition: 0,
    }),
  ],
});

export default logger;
