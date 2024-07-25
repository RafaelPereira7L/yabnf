import type { User } from '@entities/user.entity';
import * as bcrypt from 'bcrypt'
import fastify from './fastify.provider';

export default class HashProvider {
  async hash(value: string) {
    return bcrypt.hash(value, 10);
  }

  async compare(value: string, hash: string): Promise<boolean> {
    return bcrypt.compare(value, hash);
  }

  async createToken(data: Partial<User>): Promise<string> {
    return fastify.jwt.sign({ data })
  }
}