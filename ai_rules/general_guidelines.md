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