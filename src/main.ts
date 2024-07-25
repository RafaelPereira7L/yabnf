import fastify from "@providers/fastify.provider";

async function bootstrap() {
	try {
		await fastify.listen({ port: Number(process.env.PORT) || 3000 })
	} catch (err) {
		fastify.log.error(err);
		process.exit(1);
	}
}

bootstrap();