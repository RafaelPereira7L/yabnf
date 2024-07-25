import { Queue } from "bullmq";
import { InternalServerError } from "http-errors-enhanced";
import fastify from "./fastify.provider";

export default class QueueJobsProvider {
	private queue: Queue;

	constructor(queueName: string) {
		if (!process.env.REDIS_HOST || !process.env.REDIS_PORT) {
			throw new InternalServerError("Redis connection not found");
		}

		this.queue = new Queue(queueName, {
			connection: {
				host: process.env.REDIS_HOST,
				port: Number(process.env.REDIS_PORT),
			},
		});
	}

	async publish(job: string, data: object) {
    fastify.log.info(`Publishing job ${job} with data ${JSON.stringify(data)}`);
		return await this.queue.add(job, data);
	}
}
