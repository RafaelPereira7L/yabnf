import "reflect-metadata";
import fastify from "@providers/fastify.provider";
import { registerRepositories } from "@config/register-repositories";

async function bootstrap() {
	try {
		await registerRepositories();
		await fastify.listen({ port: Number(process.env.PORT) || 3000 })
	} catch (err) {
		fastify.log.error(err);
		process.exit(1);
	}
}

bootstrap();