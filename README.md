# Cursor Configuration Sample Project

This repository serves as a demonstration project showcasing Test-Driven Development (TDD) and design-driven development practices using Cursor IDE. It includes a complete shopping cart implementation with both backend and frontend components.

## Project Overview

The project consists of two main parts:
- A backend service (`shopping_cart/`) built with TypeScript and Node.js
- A frontend application (`shopping_cart_frontend/`) built with React and TypeScript

### Key Features

- **Test-Driven Development (TDD)** implementation examples
- Clean architecture and domain-driven design patterns
- Comprehensive test coverage including:
  - Unit tests
  - Contract tests
  - Component tests
- Separation of concerns with clear layer boundaries:
  - Domain layer
  - Application services
  - API controllers
  - Repositories
  - DTOs

### Project Structure

```
├── shopping_cart/           # Backend service
│   ├── src/
│   │   ├── api/            # API controllers
│   │   ├── application/    # Application services
│   │   ├── domain/        # Domain models
│   │   ├── repositories/  # Data access layer
│   │   └── __tests__/    # Test suites
│
├── shopping_cart_frontend/  # Frontend application
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── containers/    # Container components
│   │   ├── api/          # API clients
│   │   └── __tests__/    # Test suites
│
└── ai_rules/               # Cursor AI configuration guidelines
```

### Development Guidelines

The project includes a set of guidelines for working with Cursor IDE in the `ai_rules/` directory, covering:
- API design
- Frontend development
- Testing practices
- ORM usage
- Git workflows
- General implementation guidelines

## Getting Started

1. Clone this repository
2. Install dependencies for both backend and frontend:
   ```bash
   # Backend
   cd shopping_cart
   npm install

   # Frontend
   cd ../shopping_cart_frontend
   npm install
   ```
3. Follow the guidelines in `ai_rules/` directory for development practices

## Purpose

This project serves as a reference implementation for:
- Setting up Cursor IDE for efficient development
- Implementing TDD practices with proper test organization
- Structuring a full-stack TypeScript application
- Following clean architecture principles
- Utilizing Cursor's AI capabilities for development

Feel free to explore the codebase and use it as a template for your own projects! 