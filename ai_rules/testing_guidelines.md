## Testing Guidelines 

### Test Behaviour not implementation 
- The tests needs to cover a behaviour. 
- Each test should test a single behaviour.

#### Example of a good test: 

```
describe('ShoppingCart', () => { 
 it ('calculates the total price when product is added', () => {
   const product = new Product(1, 'product name', 20); 
   const cart = new ShoppingCart(); 

   cart.addProduct(product);

   expect(cart.total()).toEqual(20)
 })
})
```

#### Example of a bad test: 

```
describe('ShoppingCart', () => { 
 it ('invokes calculateTotal when addProduct is called', () => {
   const product = new Product(1, 'product name', 20); 
   const cart = new ShoppingCart(); 
   const spy = jest.spyOn(cart, 'calculateTotal');

   cart.addProduct(product);

   expect(spy).toHaveBeenCalled();
 })
})
```

### Tests must follow the following naming: 
- describe: Must have the name of the class that is been tested 
- it: describes the behavior of the test scenario 

### Test code must be separated with blank lines: 
- Tests should be easy to read and a blank line should be added between each part of the test.

#### Good Example: 
```
describe('ShoppingCart', () => { 
 it ('invokes calculateTotal when addProduct is called', () => {
   const product = new Product(1, 'product name', 20); 
   const cart = new ShoppingCart(); 
   const spy = jest.spyOn(cart, 'calculateTotal');

   cart.addProduct(product);

   expect(spy).toHaveBeenCalled();
 });
 });
 ```

#### Bad Example: 
```
describe('ShoppingCart', () => { 
 it ('invokes calculateTotal when addProduct is called', () => {
   const product = new Product(1, 'product name', 20); 
   const cart = new ShoppingCart(); 
   const spy = jest.spyOn(cart, 'calculateTotal');
   cart.addProduct(product);
   expect(spy).toHaveBeenCalled();
 });
 });
```

### Do not implement more then a single test per time 
- Every test should be implemented individually. 

#### Good example: 
```
describe('ShoppingCart', () => { 
 it ('invokes calculateTotal when addProduct is called', () => {
   const product = new Product(1, 'product name', 20); 
   const cart = new ShoppingCart(); 
   const spy = jest.spyOn(cart, 'calculateTotal');

   cart.addProduct(product);

   expect(spy).toHaveBeenCalled();
 });
 });
 ```

#### Bad example: 
```
describe('ShoppingCart', () => { 
 it ('invokes calculateTotal when addProduct is called', () => {
   const product = new Product(1, 'product name', 20); 
   const cart = new ShoppingCart(); 
   const spy = jest.spyOn(cart, 'calculateTotal');

   cart.addProduct(product);

   expect(spy).toHaveBeenCalled();
 });

 it('lists all products on the cart', () => { 
   // implementation.... 
 })
 });
```

### Testing folder is located at __tests__ under src/ and have the same structure as production code

- Testing folder should follow the same structure as production code.

### Use Fakes not mocks

- For injected dependencies create fakes and use for the tests. 

### Create contract Tests for Fakes 

- Create Contract tests for the Fakes that checks if it matches with the interface. 
- For Real dependencies e.g: Database classes, test on the contract using testcontainers. 

#### Contract Testing example: 

```
interface ProductRepository {
 getProduct(id: number): Product
 addProduct(product: Product): Promise<void>
}
```

```
describe.each([
 new FakeProductRepository(),
 new PostgesProductRepository()
])('[CONTRACT] Product Repository', (repository: ProductRepository) => {
 it('gets product', async () => {
   const product = new Product(1, 'test', 10);
   await repository.addProduct(product);

   const result = await repository.getProduct(1)

   expect(result).toEqual(product)
 })
})
```

### Contract Testing Guidelines

- Contract tests must be placed in `__contract_tests__` directory
- Each implementation must provide a cleanup process
- Cleanup must be called after each test
- Contract tests must run separately from unit tests
- Contract tests must verify all interface behaviors
- Contract tests must use real implementations (e.g., testcontainers for databases)

### Never make conditionals on testing 

- Tests must be clear to read as they are counting a story and do not any conditional

#### Good example: 
```
it('maintains separate products for different carts', async () => {
    const repository = instance();
    const product1 = new Product('1', 'Cart 1 Product', 40);
    const product2 = new Product('2', 'Cart 2 Product', 50);
    const cart1 = new ShoppingCart(repository, 'cart-1');
    const cart2 = new ShoppingCart(repository, 'cart-2');

    await repository.save(cart1, [product1]);
    await repository.save(cart2, [product2]);

    const loadedCart1 = await repository.load(cart1.id());
    const loadedCart2 = await repository.load(cart2.id());
    expect(loadedCart1.products).toEqual([product1]);
    expect(loadedCart2.products).toEqual([product2]);
  });
```

#### Bad Example: 
```
it('maintains separate products for different carts', async () => {
  const repository = instance();
  const product1 = new Product('1', 'Cart 1 Product', 40);
  const product2 = new Product('2', 'Cart 2 Product', 50);
  const cart1 = new ShoppingCart(repository, 'cart-1');
  const cart2 = new ShoppingCart(repository, 'cart-2');

  await repository.save(cart1, [product1]);
  await repository.save(cart2, [product2]);

  const loadedCart1 = await repository.load(cart1.id());
  const loadedCart2 = await repository.load(cart2.id());

  if (name === 'PostgresRepository') {
    expect(loadedCart1.products).toEqual([new Product('1', 'Test Product', 10)]);
    expect(loadedCart2.products).toEqual([new Product('2', 'Second Product', 20)]);
  } else {
    expect(loadedCart1.products).toEqual([product1]);
    expect(loadedCart2.products).toEqual([product2]);
  }
});
``` 
