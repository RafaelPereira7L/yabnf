import type UserRepository from "@repositories/user.repository";
import { NotFoundError } from "http-errors-enhanced";

export default class FindByIdUserUseCase {
	constructor(private userRepository: UserRepository) {}

	async execute(id: string) {
		const user = await this.userRepository.getById(id);
		
		if (!user) {
			throw new NotFoundError("User not found");
		}

		return user;
	}
}
