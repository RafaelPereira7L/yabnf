import { type UserDTO, users, type User } from "@entities/user.entity";
import { db } from "@providers/database.provider";

export default class UserRepository implements BaseRepository<User> {
	private readonly db: typeof db;

	constructor() {
		this.db = db;
	}

	async getAll(): Promise<User[]> {
		return await this.db.query.users.findMany({
			columns: { password: false },
		}) as User[];
	}
	async getById(id: string): Promise<User | null> {
		return (
			((await db.query.users.findFirst({
				where: (users, { eq }) => eq(users.id, id),
				columns: { password: false },
			})) as User) || null
		);
	}

	async getByEmail(email: string): Promise<User | null> {
		return await db.query.users.findFirst({
			where: (users, { eq }) => eq(users.email, email),
		}) as User;
	}

	async create(data: UserDTO): Promise<string> {
		const user = await this.db.insert(users).values(data).returning();
		return user[0].id;
	}

	update(id: string, data: User): Promise<User> {
		throw new Error("Method not implemented.");
	}
	delete(id: string): Promise<void> {
		throw new Error("Method not implemented.");
	}
}
