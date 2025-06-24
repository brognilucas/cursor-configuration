# Development Guidelines for Cursor  

This is an overall development guideline for Cursor in order to guarantee that the AI Agent building the code will use the rules set here. 

## Always give a plan for the implementation

- Before any implementation give an implementation plan for confirmation. If the plan is denied, please ask for a new plan. 

## Clarify open questions 

- When an instruction is given and it has not clear instructions ask for more details

## Never use inline types
- When building a function that requires an object, create a type in a separate file for the referral type in case it doesn't exist. 
- Don't do: `async execute(cartId: string, product: { id: string; name: string; price: number }): Promise<void>`

## Never use fakes for production code 
- A fake should only be used in the test context. Any code that is not a test should not know a fake exist. 
- Fakes should live under the __tests__ folder 

## Testing Guidelines 

### Test First (TDD)
- Every new piece of code needs to have a test, meaning that when creating a new functionality TDD must be followed. 

### Test Behaviour not implementation 
- The tests needs to cover a behaviour. 

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

### Bad Example: 
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

## Implementation Guidelines 

### After every test that passes a commit must be done 

- After implementing a single test and making it pass, confirm if a commit must be done. 

## Git Guidelines 

### Commits follows the specific format: 

#### New feature: 
 
`feat(Class): description of feature 

Detailed description of feature`


#### Bug Fix: 
`fix(Class): description of bug fix 

Detailed description of bug fix including previous root cause`

## Classes Guidelines 

### Private properties should have name with _

- Private properties should be named following name: `_product`, `_price`, etc. 

### Public methods don't need to have get or set: 
- Public methods can be accessed using direct naming as: `product`, `price` 


## ORM RULES

### Separate entities
- Never use json columns unless explicit said. All entities needs to have its own table on the database. 

### Apply Lazy-Loading whenever possible
- Whenever is possible use lazy loading for the entities instead of getting it upfront. 

### Apply transaction control 
- Always make sure to have a transaction in the context in order to prevent inconsistent states


## API Guidelines

### If an API is already in place keep the same framework
- If an API is already existing, never pick another framework to add new endpoints  

### Confirm Information About Architecture / Layers
- Before implementing any new feature, always ask the user if not informed upfront:
- If they want to apply a specific architecture (e.g., hexagonal, layered, MVC, DDD, etc.).
- If yes, which architecture should be used?
- Which layers/components should be implemented for this feature? (e.g., controller, service, domain, repository, adapter)
- Example prompt:
 > “Do you want to use a specific architecture for this feature (e.g., hexagonal, layered, MVC)? If so, which one, and which layers should I implement?”


### Confirm if integration tests are needed
- When building APIs always confirm if there are the need of an integration test.

### Always use routes with plural noums 
- Use `/carts` instead of `/cart`