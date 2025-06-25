import { DataSource } from 'typeorm';
import { ShoppingCartEntity } from '../entities/ShoppingCartEntity';
import { ProductEntity } from '../entities/ProductEntity';
import { CartProductEntity } from '../entities/CartProductEntity';
import { UserEntity } from '../entities/UserEntity';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'randomhost',
  port: parseInt(process.env.DB_PORT!),
  username: process.env.DB_USERNAME!,
  password: process.env.DB_PASSWORD!,
  database: process.env.DB_NAME!,
  synchronize: true,
  logging: false,
  entities: [ShoppingCartEntity, ProductEntity, CartProductEntity, UserEntity],
  migrations: [],
  subscribers: [],
}); 