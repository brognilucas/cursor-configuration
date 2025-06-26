import { Repository, DataSource } from 'typeorm';
import { ProductEntity } from '../entities/ProductEntity';
import { ProductRepository } from './ProductRepository';
import { Product } from '../domain/Product';

export class PostgresProductRepository implements ProductRepository {
  private _repository: Repository<ProductEntity>;

  constructor(dataSource: DataSource) {
    this._repository = dataSource.getRepository(ProductEntity);
  }

  async findAll(): Promise<Product[]> {
    const entities = await this._repository.find();
    return entities.map(entity => new Product(entity.id, entity.name, Number(entity.price)));
  }

  async findById(id: string): Promise<Product | null> {
    const entity = await this._repository.findOne({ where: { id } });
    if (!entity) {
      return null;
    }
    return new Product(entity.id, entity.name, Number(entity.price));
  }

  async save(product: Product): Promise<void> {
    const entity = new ProductEntity();
    entity.id = product.id();
    entity.name = product.name();
    entity.price = product.price();
    
    await this._repository.save(entity);
  }
} 