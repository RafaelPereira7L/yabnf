import { AutoInjectable } from "@config/decorators/auto-injectable.decorator";
import { Validate } from "@config/decorators/validator.decorator";
import { UpdateUserSchema, type UserDTO } from "@entities/user.entity";
import HashProvider from "@providers/hash.provider";
import UserRepository from "@repositories/user.repository";
import { NotFoundError } from 'http-errors-enhanced'
import { inject } from "tsyringe";

@AutoInjectable()
export default class UpdateUserUseCase {
	private readonly hashProvider: HashProvider = new HashProvider();

	constructor(@inject(UserRepository) private userRepository: UserRepository) {}

	@Validate(UpdateUserSchema)
	async execute(id: string, data: UserDTO) {
		const user = await this.userRepository.getById(id)

		if (!user) {
				throw new NotFoundError('User not found')
		}

		if(data.password) {
			data.password = await this.hashProvider.hash(data.password);
		}

		return this.userRepository.update(id, data);
	}
}
