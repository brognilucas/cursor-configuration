import { Product } from '../../domain/Product';
import { ShoppingCart } from '../../domain/ShoppingCart';
import { FakeShoppingCartRepository } from '../repositories/FakeShoppingCartRepository';

describe('ShoppingCart', () => {
  let repository: FakeShoppingCartRepository;

  beforeEach(() => {
    repository = new FakeShoppingCartRepository();
  });

  it('returns empty list when no products are in cart', async () => {
    const cart = new ShoppingCart(repository);

    const products = await cart.listProducts();

    expect(products).toHaveLength(0);
  });

  it('lists a single product when one product is added to cart (length)', async () => {
    const product = new Product('1', 'Test Product', 20);
    const cart = new ShoppingCart(repository);

    await cart.addProduct(product);

    const products = await cart.listProducts();

    expect(products).toHaveLength(1);
  });

  it('lists a single product when one product is added to cart (equality)', async () => {
    const product = new Product('1', 'Test Product', 20);
    const cart = new ShoppingCart(repository);

    await cart.addProduct(product);

    const products = await cart.listProducts();

    expect(products[0]).toEqual(product);
  });

  it('lists multiple products when multiple products are added to cart (length)', async () => {
    const product1 = new Product('1', 'First Product', 20);
    const product2 = new Product('2', 'Second Product', 30);
    const product3 = new Product('3', 'Third Product', 40);
    const cart = new ShoppingCart(repository);

    await cart.addProduct(product1);
    await cart.addProduct(product2);
    await cart.addProduct(product3);

    const products = await cart.listProducts();

    expect(products).toHaveLength(3);
  });

  it('lists multiple products when multiple products are added to cart (contains product1)', async () => {
    const product1 = new Product('1', 'First Product', 20);
    const product2 = new Product('2', 'Second Product', 30);
    const product3 = new Product('3', 'Third Product', 40);
    const cart = new ShoppingCart(repository);

    await cart.addProduct(product1);
    await cart.addProduct(product2);
    await cart.addProduct(product3);

    const products = await cart.listProducts();

    expect(products).toContainEqual(product1);
  });

  it('lists multiple products when multiple products are added to cart (contains product2)', async () => {
    const product1 = new Product('1', 'First Product', 20);
    const product2 = new Product('2', 'Second Product', 30);
    const product3 = new Product('3', 'Third Product', 40);
    const cart = new ShoppingCart(repository);

    await cart.addProduct(product1);
    await cart.addProduct(product2);
    await cart.addProduct(product3);

    const products = await cart.listProducts();

    expect(products).toContainEqual(product2);
  });

  it('lists multiple products when multiple products are added to cart (contains product3)', async () => {
    const product1 = new Product('1', 'First Product', 20);
    const product2 = new Product('2', 'Second Product', 30);
    const product3 = new Product('3', 'Third Product', 40);
    const cart = new ShoppingCart(repository);

    await cart.addProduct(product1);
    await cart.addProduct(product2);
    await cart.addProduct(product3);

    const products = await cart.listProducts();

    expect(products).toContainEqual(product3);
  });
}); 