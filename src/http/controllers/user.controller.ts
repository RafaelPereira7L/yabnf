import FindAllUserUseCase from "@useCases/user/user-findall.usecase";
import CreateUserUseCase from "@useCases/user/user-create.usecase";
import { Controller, GET, POST } from "fastify-decorators";
import FindByIdUserUseCase from "@useCases/user/user-findbyid.usecase";
import AuthUserUseCase from "@useCases/user/user-auth.usecase";
// import MailerProvider from "@providers/mailer.provider";
// import QueueJobsProvider from "@providers/queue-jobs.provider";
// import QueueWorkerProvider from "@providers/queue-worker.provider";
import { autoInjectable, inject } from "tsyringe";

@Controller({ route: "/users" })
@autoInjectable()
export default class UserController {
	// private readonly mailProvider: MailerProvider;
	// private readonly queueJobsProvider: QueueJobsProvider;
	// private readonly queueWorkerProvider: QueueWorkerProvider;

	constructor(
		@inject(FindAllUserUseCase)
		private userFindAllUseCase: FindAllUserUseCase,
		@inject(CreateUserUseCase)
		private userCreateUseCase: CreateUserUseCase,
		@inject(FindByIdUserUseCase)
		private userFindByIdUseCase: FindByIdUserUseCase,
		// @inject(AuthUserUseCase) private userAuthUseCase: AuthUserUseCase,
	) {
		// this.mailProvider = new MailerProvider("resend");
		// this.queueJobsProvider = new QueueJobsProvider("test");
		// this.queueWorkerProvider = new QueueWorkerProvider("test");
	}

	@GET({ url: "/" })
	async getAll() {
		return this.userFindAllUseCase.execute();
	}

	@GET({ url: "/:id" })
	async getById(request) {
		const { id } = request.params;
		return this.userFindByIdUseCase.execute(id);
	}

	@POST({ url: "/" })
	async create(request) {
		const { body } = request;
		return this.userCreateUseCase.execute(body);
	}

	// @POST({ url: "/auth" })
	// async auth(request) {
	// 	const { body } = request;
	// 	return this.userAuthUseCase.execute(body);
	// }

	// @POST({ url: "/test-mail" })
	// async mail(request) {
	// 	return this.mailProvider.sendEmail({
	// 		to: ["cooltzada@gmail.com"],
	// 		subject: "test send mail",
	// 		html: "<h1>test send mail</h1>",
	// 		text: "test send mail",
	// 	});
	// }

	// @POST({ url: "/job" })
	// async job(request) {
	// 	await this.queueJobsProvider.publish("test", { message: "xpto" });

	// 	await this.queueWorkerProvider.consume(async (job) => {
	// 		console.log(job.data);
	// 	});

	// 	return { message: "job published and consumed" };
	// }
}
