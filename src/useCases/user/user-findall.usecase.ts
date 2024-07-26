import { AutoInjectable } from "@config/decorators/auto-injectable.decorator";
import type UserRepository from "@repositories/user.repository";
import { inject } from "tsyringe";

@AutoInjectable()
export default class FindAllUserUseCase {
	constructor(@inject("UserRepository") private userRepository: UserRepository) {}

	execute() {
		return this.userRepository.getAll();
	}
}
