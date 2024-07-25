interface BaseRepository<T> {
  getAll(): Promise<T[]>;
  getById(id: string): Promise<T | null>;
  getByEmail(email: string): Promise<T | null>;
  create(data: T): Promise<string>;
  update(id: string, data: T): Promise<T>;
  delete(id: string): Promise<void>;
}