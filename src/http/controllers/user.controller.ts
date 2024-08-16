import FindAllUserUseCase from "@useCases/user/user-findall.usecase";
import CreateUserUseCase from "@useCases/user/user-create.usecase";
import { Controller, DELETE, GET, POST, PUT } from "fastify-decorators";
import FindByIdUserUseCase from "@useCases/user/user-findbyid.usecase";
import AuthUserUseCase from "@useCases/user/user-auth.usecase";
import { autoInjectable, inject } from "tsyringe";
import { AuthGuard, Guest } from "@http/middlewares/auth.middleware";
import { CreateUserSchema, UpdateUserSchema } from "@entities/user.entity";
import { zodToJsonSchema } from "zod-to-json-schema";
import UpdateUserUseCase from "@useCases/user/user-update.usecase";
import DeleteUserUseCase from "@useCases/user/user-delete.usecase";

@Controller({ route: "/users" })
@autoInjectable()
@AuthGuard()
export default class UserController {
	constructor(
		@inject(FindAllUserUseCase)
		private userFindAllUseCase: FindAllUserUseCase,
		@inject(CreateUserUseCase)
		private userCreateUseCase: CreateUserUseCase,
		@inject(FindByIdUserUseCase)
		private userFindByIdUseCase: FindByIdUserUseCase,
		@inject(UpdateUserUseCase) private userUpdateUseCase: UpdateUserUseCase,
		@inject(DeleteUserUseCase) private userDeleteUseCase: DeleteUserUseCase,
		@inject(AuthUserUseCase) private userAuthUseCase: AuthUserUseCase,
	) {}

	@POST({
		url: "/auth",
		options: {
			schema: {
				body: {
					type: "object",
					properties: {
						email: { type: "string", format: "email" },
						password: { type: "string" },
					},
					required: ["email", "password"],
				},
			},
		},
	})
	@Guest()
	async auth(request) {
		const { body } = request;
		const token = await this.userAuthUseCase.execute(body);

		return { token };
	}

	@GET({ url: "/", options: { schema: { querystring: { type: "object", properties: { page: { type: "number" }, limit: { type: "number" } } } } } })
	async getAll(request) {
		const { page, limit } = request.query;

		return this.userFindAllUseCase.execute({ page, limit });
	}

	@GET({ url: "/:id" })
	async getById(request) {
		const { id } = request.params;
		return this.userFindByIdUseCase.execute(id);
	}

	@POST({
		url: "/",
		options: {
			schema: {
				body: zodToJsonSchema(CreateUserSchema),
			},
		},
	})
	@Guest()
	async create(request, reply) {
		const { body } = request;
		const user = await this.userCreateUseCase.execute(body);
		return reply.status(201).send(user);
	}

	@PUT({
		url: "/:id",
		options: {
			schema: {
				body: zodToJsonSchema(UpdateUserSchema),
			}
	}})
	async update(request) {
		const { id } = request.params;
		const { body } = request;
		const user = await this.userUpdateUseCase.execute(id, body);
		return user;
	}

	@DELETE({ url: "/:id" })
	async delete(request) {
		const { id } = request.params;
		await this.userDeleteUseCase.execute(id);
		return { message: 'User deleted' };
	}
}
