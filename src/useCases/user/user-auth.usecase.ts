import type { UserDTO } from "@entities/user.entity";
import HashProvider from "@providers/hash.provider";
import type UserRepository from "@repositories/user.repository";
import { NotFoundError } from 'http-errors-enhanced'

export default class AuthUserUseCase {
	private readonly hashProvider: HashProvider = new HashProvider();

	constructor(private userRepository: UserRepository) {}

	async execute(data: UserDTO) {
		const user = await this.userRepository.getByEmail(data.email)

		if (!user) {
			throw new NotFoundError('User not found')
		}

		const isValidPassword = await this.hashProvider.compare(data.password, user.password)

    if (!isValidPassword) {
      throw new NotFoundError('User not found')
    }

		return this.hashProvider.createToken({
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    })
	}
}
