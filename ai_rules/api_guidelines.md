## API Guidelines

### If an API is already in place keep the same framework
- If an API is already existing, never pick another framework to add new endpoints  

### Confirm Information About Architecture / Layers
- Before implementing any new feature, always ask the user if not informed upfront:
- If they want to apply a specific architecture (e.g., hexagonal, layered, MVC, DDD, etc.).
- If yes, which architecture should be used?
- Which layers/components should be implemented for this feature? (e.g., controller, service, domain, repository, adapter)
- Example prompt:
 > "Do you want to use a specific architecture for this feature (e.g., hexagonal, layered, MVC)? If so, which one, and which layers should I implement?"

### Confirm if integration tests are needed
- When building APIs always confirm if there are the need of an integration test.

### Always use routes with plural noums 
- Use `/carts` instead of `/cart` 