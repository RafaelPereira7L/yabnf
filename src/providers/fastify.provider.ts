import Fastify from "fastify";
import { bootstrap } from "fastify-decorators";
import fastifyHttpErrorsEnhanced from 'fastify-http-errors-enhanced'
import fastifyJwt from "@fastify/jwt";

const fastify = Fastify({
	logger: {
		transport: {
			target: "@fastify/one-line-logger",
		},
	},
});
fastify.register(bootstrap, {
	directory: `${__dirname}/../http`,
	mask: /\.controller\./,
});

fastify.register(fastifyHttpErrorsEnhanced);

fastify.register(fastifyJwt, {
	secret: process.env.JWT_SECRET || "",
	sign: {
    expiresIn: '1d'
  }
});

fastify.setErrorHandler((error, _, reply) => {
	reply.status(error.statusCode || 500).send({
		statusCode: error.statusCode || 500,
		error: error.name,
		message: error.message,
	});
}
);

fastify.get("/health", async function handler(request, reply) {
	return { hello: "world" };
});

export default fastify;