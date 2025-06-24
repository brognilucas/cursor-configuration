import { DataSource, Repository } from 'typeorm';
import { Product } from '../Product';
import { ShoppingCartRepository, CartData } from './ShoppingCartRepository';
import { ShoppingCartEntity } from '../entities/ShoppingCartEntity';
import { CartProductEntity } from '../entities/CartProductEntity';
import { ShoppingCart } from '../ShoppingCart';

export class PostgresShoppingCartRepository implements ShoppingCartRepository {
  private readonly cartRepository: Repository<ShoppingCartEntity>;
  private readonly cartProductRepository: Repository<CartProductEntity>;

  constructor(dataSource: DataSource) {
    this.cartRepository = dataSource.getRepository(ShoppingCartEntity);
    this.cartProductRepository = dataSource.getRepository(CartProductEntity);
  }

  async save(cart: ShoppingCart, products: Product[]): Promise<void> {
    let entity = await this.cartRepository.findOne({ where: { id: cart.id() } });
    if (!entity) {
      entity = new ShoppingCartEntity();
      entity.id = cart.id();
      await this.cartRepository.save(entity);
    }

    await this.cartProductRepository.delete({ cart_id: cart.id() });

    const cartProducts = products.map(product => {
      const cp = new CartProductEntity();
      cp.cart_id = cart.id();
      cp.product_id = product.id();
      cp.quantity = 1;
      return cp;
    });
    await this.cartProductRepository.save(cartProducts);
  }

  async load(id: string): Promise<CartData> {
    const cartProducts = await this.cartProductRepository.find({
      where: { cart_id: id },
      relations: ['product']
    });
    const products = cartProducts.map(cp =>
      new Product(cp.product_id, cp.product?.name || '', Number(cp.product?.price) || 0)
    );
    return { id, products };
  }
} 