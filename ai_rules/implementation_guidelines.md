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