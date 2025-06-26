# Microservices Guidelines

These guidelines help maintain consistency, scalability, and maintainability when building microservices.

## Design & Architecture

### Single Responsibility Principle (SRP)
- Each service should do one thing well. Keep responsibilities focused and cohesive.

### Bounded Context
- Design services around business domains. Avoid overlapping responsibilities across services.

### Statelessness
  Microservices should not maintain internal state. Use external databases or caches for persistence.

### Isolation First
- Services must be independently deployable, testable, and scalable.

### Explicit APIs
- Define contracts clearly. Use OpenAPI/Swagger for documentation and version your APIs.

## Communication

### Prefer Async over Sync
- Use event-driven communication to decouple services.

### Avoid Chatty Services
- Minimize the number of synchronous calls between services.

### Idempotency
- Ensure repeated requests (especially in retries) do not cause duplicate effects.

### Correlation IDs
- Use correlation IDs for tracing requests across service boundaries.

### Timeouts & Retries
- Always set timeouts on external calls. Implement retries with backoff and circuit breakers.


### Security & Resilience

### Zero Trust
- Authenticate and authorize every request, even between internal services.

### Rate Limiting
- Protect your services with rate limiting and throttling.

### Input Validation
- Validate all incoming data, especially from other services.

### Graceful Degradation
- Plan for failures—fail fast, fallback gracefully, and alert appropriately.

✅ Use this checklist during design reviews, implementation, and code reviews for every microservice.

