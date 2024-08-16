import Fastify from "fastify";
import { bootstrap } from "fastify-decorators";
import fastifyHttpErrorsEnhanced from "fastify-http-errors-enhanced";
import fastifyJwt from "@fastify/jwt";
import fastifySwagger from "@fastify/swagger";
import type HttpError from "@config/http-error";

const fastify = Fastify({
	logger: {
		transport: {
			target: "@fastify/one-line-logger",
		},
	},
});

fastify.register(fastifySwagger, {
	openapi: {
		info: {
			title: "yabnf.ts",
			version: "1.0.0",
		},
		components: {
			securitySchemes: {
				Authorization: {
					type: "http",
					scheme: "bearer",
					bearerFormat: "JWT",
				},
			},
		},
	},
});
fastify.register(bootstrap, {
	directory: `${__dirname}/../http`,
	mask: /\.controller\./,
});
fastify.register(require("@scalar/fastify-api-reference"), {
	routePrefix: "/reference",
	configuration: {
		spec: {
			content: () => fastify.swagger(),
		},
	},
});



fastify.register(fastifyHttpErrorsEnhanced);

fastify.register(fastifyJwt, {
	secret: process.env.JWT_SECRET ?? "",
	sign: {
		expiresIn: "1d",
	},
});

fastify.setErrorHandler((error: HttpError, _, reply) => {
	reply.status(error.statusCode ?? 500).send({
		statusCode: error.statusCode ?? 500,
		error: error.name,
		message: error.message,
		failedValidations: error.failedValidations,
	});
});

fastify.get("/health", async function handler(request, reply) {
	return { hello: "world" };
});

export default fastify;