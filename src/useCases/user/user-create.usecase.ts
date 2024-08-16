import { AutoInjectable } from "@config/decorators/auto-injectable.decorator";
import { Validate } from "@config/decorators/validator.decorator";
import { CreateUserSchema, type UserDTO } from "@entities/user.entity";
import HashProvider from "@providers/hash.provider";
import UserRepository from "@repositories/user.repository";
import { BadRequestError } from 'http-errors-enhanced'
import { inject } from "tsyringe";

@AutoInjectable()
export default class CreateUserUseCase {
	private readonly hashProvider: HashProvider = new HashProvider();

	constructor(@inject(UserRepository) private userRepository: UserRepository) {}

	@Validate(CreateUserSchema)
	async execute(data: UserDTO) {
		const user = await this.userRepository.getByEmail(data.email)

		if (user) {
			throw new BadRequestError('User already exists')
		}

		data.password = await this.hashProvider.hash(data.password);

		return this.userRepository.create(data);
	}
}
