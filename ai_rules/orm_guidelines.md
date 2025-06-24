## ORM RULES

### Separate entities
- Never use json columns unless explicit said. All entities needs to have its own table on the database. 

### Apply Lazy-Loading whenever possible
- Whenever is possible use lazy loading for the entities instead of getting it upfront. 

### Apply transaction control 
- Always make sure to have a transaction in the context in order to prevent inconsistent states 