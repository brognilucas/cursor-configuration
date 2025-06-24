import { ProductRepository } from './ProductRepository';
import { Product } from '../domain/Product';
import { DataSource, Repository } from 'typeorm';
import { ProductEntity } from '../entities/ProductEntity';

export class PostgresProductRepository implements ProductRepository {
  private _repo: Repository<ProductEntity>;

  constructor(dataSource: DataSource) {
    this._repo = dataSource.getRepository(ProductEntity);
  }

  async findAll(): Promise<Product[]> {
    const entities = await this._repo.find();
    return entities.map(e => new Product(e.id, e.name, Number(e.price)));
  }

  async save(product: Product): Promise<void> {
    const entity = new ProductEntity();
    entity.id = product.id();
    entity.name = product.name();
    entity.price = product.price();
    await this._repo.save(entity);
  }
} 