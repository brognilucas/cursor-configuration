import { Product } from '../Product';
# Development Guidelines for Cursor  

This is an overall development guideline for Cursor in order to guarantee that the AI Agent building the code will use the rules set here. 


## Always give a plan for the implementation

- Before any implementation give an implementation plan for confirmation. If the plan is denied, please ask for a new plan. 

## Clarify open questions 

- When an instruction is given and it has not clear instructions ask for more details

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
