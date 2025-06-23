import { DataSource, Repository } from 'typeorm';
import { Product } from '../Product';
import { ShoppingCartRepository, CartData } from './ShoppingCartRepository';
import { ShoppingCartEntity } from '../entities/ShoppingCartEntity';
import { ShoppingCart } from '../ShoppingCart';

export class PostgresShoppingCartRepository implements ShoppingCartRepository {
  private readonly repository: Repository<ShoppingCartEntity>;

  constructor(dataSource: DataSource) {
    this.repository = dataSource.getRepository(ShoppingCartEntity);
  }

  async save(cart: ShoppingCart, products: Product[]): Promise<void> {
    const entity = new ShoppingCartEntity();
    entity.id = cart.id();
    entity.products = products.map(product => ({
      id: product.id(),
      name: product.name(),
      price: product.price()
    }));

    await this.repository.save(entity);
  }

  async load(id: string): Promise<CartData> {
    const entity = await this.repository.findOne({ where: { id } });
    
    if (!entity) {
      return { id, products: [] };
    }

    return {
      id: entity.id,
      products: entity.products.map(p => new Product(p.id, p.name, p.price))
    };
  }
} 