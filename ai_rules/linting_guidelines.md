# Linting Guidelines

## Overview
All code must be compliant with the existing ESLint rules configured in the project. These rules are defined in the eslint configuration and must be strictly followed.

## ESLint Configuration Compliance

### Mandatory Rules

#### 1. No Explicit Any
- **Rule**: `@typescript-eslint/no-explicit-any: error`
- **Requirement**: Never use the `any` type. Use proper TypeScript types instead
- **Example**:
  ```typescript
  // ✅ Correct
  function processData(data: unknown): string {
    return String(data);
  }
  
  // ❌ Incorrect
  function processData(data: any): string {
    return String(data);
  }
  ```

#### 2. No Unused Variables
- **Rule**: `@typescript-eslint/no-unused-vars: error`
- **Requirement**: Remove all unused variables, parameters, and imports
- **Example**:
  ```typescript
  // ✅ Correct
  function processUser(user: User): void {
    console.log(user.name);
  }
  
  // ❌ Incorrect
  function processUser(user: User, age: number): void {
    console.log(user.name);
    // age is unused
  }
  ```

## Code Quality Standards

### Before Submitting Code
1. **Run ESLint**: Always run `npm run lint` before committing code
2. **Fix All Errors**: All ESLint errors must be resolved
3. **No Warnings**: Treat warnings as errors and fix them
4. **TypeScript Compliance**: Ensure all TypeScript compilation errors are resolved

### Integration with Development Workflow
- ESLint runs automatically in the development environment
- Code reviews must include linting compliance checks
- CI/CD pipelines should include linting as a mandatory step

### Common Patterns to Follow

#### Proper Type Definitions
```typescript
// ✅ Correct
interface User {
  id: string;
  name: string;
  email: string;
}

function createUser(userData: Omit<User, 'id'>): User {
  return {
    id: generateId(),
    ...userData
  };
}
```

#### Error Handling
```typescript
// ✅ Correct
function divideNumbers(a: number, b: number): number {
  if (b === 0) {
    throw new Error('Division by zero is not allowed');
  }
  return a / b;
}
```

#### Async Functions
```typescript
// ✅ Correct
async function fetchUserData(userId: string): Promise<User> {
  const response = await fetch(`/api/users/${userId}`);
  return response.json();
}
```

## Enforcement
- All code changes must pass ESLint validation
- No exceptions to these rules without explicit approval
- Automated tools should enforce these rules in the development workflow
- Code reviews must verify linting compliance

## Tools and Commands
- **Lint Check**: `npm run lint`
- **Lint Fix**: `npm run lint -- --fix` (when applicable)
- **IDE Integration**: Configure your IDE to show ESLint errors in real-time 