/** @format */

import Transport from "winston-transport";
import { Logform } from "winston";

interface KafkaTransportOptions extends Transport.TransportStreamOptions {
  topic?: string;
  partition?: number;
  key?: string | null;
}

export class KafkaTransport extends Transport {
  private topic: string;
  private partition: number;
  private key: string | null;

  constructor(opts: KafkaTransportOptions) {
    super(opts);
    this.topic = opts.topic || "logs_topic";
    this.partition = opts.partition ?? 0;
    this.key = opts.key ?? null;
  }

  // Winston calls this when logging
  public async log(
    info: Logform.TransformableInfo,
    callback: () => void
  ): Promise<void> {
    setImmediate(() => {
      this.emit("logged", info);
    });

    try {
      // await kafkaProducer(this.topic, info, this.key, this.partition);
    } catch (err) {
      console.error("Kafka logging failed:", err);
    }

    callback();
  }
}
