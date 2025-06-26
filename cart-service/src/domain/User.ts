export class User {
  constructor(
    private readonly _id: string,
    private readonly _email: string,
    private readonly _name: string,
    private readonly _password: string
  ) {}

  id(): string {
    return this._id;
  }

  email(): string {
    return this._email;
  }

  name(): string {
    return this._name;
  }

  password(): string {
    return this._password;
  }
} 