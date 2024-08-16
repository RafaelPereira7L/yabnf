import { type UserDTO, users, type User } from "@entities/user.entity";
import { db } from "@providers/database.provider";
import { eq } from "drizzle-orm";

export default class UserRepository implements BaseRepository<User> {
	private readonly db: typeof db;

	constructor() {
		this.db = db;
	}

	async getAll(pagination: Pagination): Promise<User[]> {
		return await this.db.query.users.findMany({
			columns: { password: false },
			limit: pagination.limit || 50,
			offset: (pagination.limit * (pagination.page - 1)) || 0, 
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

	async update(id: string, data: UserDTO): Promise<User> {
		const user = await this.db.update(users).set(data).where(eq(users.id, id)).returning({ id: users.id })

		return user[0] as User;
	}
	async delete(id: string): Promise<boolean> {
		const userDeleted = await this.db.delete(users).where(eq(users.id, id)).returning({ deletedId: users.id });
		
		return userDeleted.length > 0;
	}
}
