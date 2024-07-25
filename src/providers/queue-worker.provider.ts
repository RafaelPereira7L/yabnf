import { type Job, type JobData, Worker } from "bullmq";
import { InternalServerError } from "http-errors-enhanced";
import fastify from "./fastify.provider";

export default class QueueWorkerProvider {
	private worker: Worker;
	private queueName: string;

	constructor(queueName: string) {
		if (!process.env.REDIS_HOST || !process.env.REDIS_PORT) {
			throw new InternalServerError("Redis connection not found");
		}

		if (!queueName)
			throw new InternalServerError("Please provide a queue name");

		this.queueName = queueName;
	}

	async consume(processFunction: (job: Job<JobData>) => Promise<void> | void) {
		this.worker = new Worker(this.queueName, async (job) => {
			fastify.log.info(
				`Consuming job ${job.name} with data ${JSON.stringify(job.data)}`,
			);
			await processFunction(job);
		}, {
      connection: {
        host: process.env.REDIS_HOST,
        port: Number(process.env.REDIS_PORT),
      }
    });
	}
}
