import UserRepository from '@repositories/user.repository';
import FindAllUserUseCase from '@useCases/user/user-findall.usecase';
import CreateUserUseCase from '@useCases/user/user-create.usecase';
import { Controller, GET, POST } from 'fastify-decorators';
import FindByIdUserUseCase from '@useCases/user/user-findbyid.usecase';
import AuthUserUseCase from '@useCases/user/user-auth.usecase';

@Controller({ route: '/users' })
export default class UserController {
  private readonly userRepository: UserRepository;
  private readonly userFindAllUseCase: FindAllUserUseCase;
  private readonly userCreateUseCase: CreateUserUseCase;
  private readonly userFindByIdUseCase: FindByIdUserUseCase;
  private readonly userAuthUseCase: AuthUserUseCase;

  constructor() {
    this.userRepository = new UserRepository();
    this.userFindAllUseCase = new FindAllUserUseCase(this.userRepository);
    this.userCreateUseCase = new CreateUserUseCase(this.userRepository);
    this.userFindByIdUseCase = new FindByIdUserUseCase(this.userRepository);
    this.userAuthUseCase = new AuthUserUseCase(this.userRepository);
  }

  @GET({ url: '/' })
  async getAll() {
    return this.userFindAllUseCase.execute();
  }

  @GET({ url: '/:id' })
  async getById(request) {
    const { id } = request.params;
    return this.userFindByIdUseCase.execute(id);
  }

  @POST({ url: '/' })
  async create(request) {
    const { body } = request;
    return this.userCreateUseCase.execute(body);
  }

  @POST({ url: '/auth' })
  async auth(request) {
    const { body } = request;
    return this.userAuthUseCase.execute(body);
  }
}