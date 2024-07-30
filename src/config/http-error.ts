import type { FastifyError } from "fastify";

export default interface HttpError extends FastifyError {
	failedValidations?: {
		[x: string]: string[] | undefined;
		[x: number]: string[] | undefined;
		[x: symbol]: string[] | undefined;
	};
}
