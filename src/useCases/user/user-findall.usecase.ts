import type UserRepository from "@repositories/user.repository";

export default class FindAllUserUseCase {
	constructor(private userRepository: UserRepository) {}

	execute() {
		return this.userRepository.getAll();
	}
}
