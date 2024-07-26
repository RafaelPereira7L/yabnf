import { AutoInjectable } from "@config/decorators/auto-injectable.decorator";
import type UserRepository from "@repositories/user.repository";
import { NotFoundError } from "http-errors-enhanced";
import { inject } from "tsyringe";

@AutoInjectable()
export default class FindByIdUserUseCase {
	constructor(@inject("UserRepository") private userRepository: UserRepository) {}

	async execute(id: string) {
		const user = await this.userRepository.getById(id);
		
		if (!user) {
			throw new NotFoundError("User not found");
		}

		return user;
	}
}
