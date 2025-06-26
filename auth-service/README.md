# Auth Service

Authentication microservice for the shopping cart application.

## Features

- User registration and authentication
- JWT token generation and validation
- Password hashing with bcrypt
- PostgreSQL database integration

## Architecture

- **Domain Layer**: User domain model
- **Repository Layer**: User repository with fake and PostgreSQL implementations
- **Application Layer**: Signin and Signup services (to be added in Phase 2)
- **API Layer**: REST API endpoints (to be added in Phase 3)

## Development

### Prerequisites

- Node.js 18+
- PostgreSQL
- Docker (optional)

### Installation

```bash
npm install
```

### Running Tests

```bash
# Unit tests
npm test

# Contract tests
npm run test:contract

# All tests
npm run test:all
```

### Development Server

```bash
npm run dev
```

### Docker

```bash
# Build and run with Docker Compose
docker-compose up --build
```

## Environment Variables

- `DB_HOST`: PostgreSQL host (default: localhost)
- `DB_PORT`: PostgreSQL port (default: 5432)
- `DB_USERNAME`: PostgreSQL username (default: postgres)
- `DB_PASSWORD`: PostgreSQL password (default: postgres)
- `DB_NAME`: PostgreSQL database name (default: auth_service)
- `PORT`: Service port (default: 3001)

## API Endpoints

To be added in Phase 3.

## Testing Strategy

- **Contract Tests**: Ensure fake and real repository implementations behave identically
- **Unit Tests**: Test individual components in isolation
- **Integration Tests**: Test API endpoints (to be added)

## Database Schema

```sql
CREATE TABLE users (
  id VARCHAR PRIMARY KEY,
  email VARCHAR UNIQUE NOT NULL,
  name VARCHAR NOT NULL,
  password VARCHAR NOT NULL
);
``` 