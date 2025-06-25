import { DataSource, Repository } from 'typeorm';
import { User } from '../domain/User';
import { UserRepository } from './UserRepository';
import { UserEntity } from '../entities/UserEntity';

export class PostgresUserRepository implements UserRepository {
  private readonly userRepository: Repository<UserEntity>;

  constructor(dataSource: DataSource) {
    this.userRepository = dataSource.getRepository(UserEntity);
  }

  async save(user: User): Promise<void> {
    const entity = new UserEntity();
    entity.id = user.id();
    entity.email = user.email();
    entity.name = user.name();
    entity.password = user.password();

    await this.userRepository.save(entity);
  }

  async findByEmail(email: string): Promise<User | null> {
    const entity = await this.userRepository.findOne({ where: { email } });
    
    if (!entity) {
      return null;
    }

    return new User(entity.id, entity.email, entity.name, entity.password);
  }

  async findById(id: string): Promise<User | null> {
    const entity = await this.userRepository.findOne({ where: { id } });
    
    if (!entity) {
      return null;
    }

    return new User(entity.id, entity.email, entity.name, entity.password);
  }

  async clear(): Promise<void> {
    await this.userRepository.clear();
  }
} 