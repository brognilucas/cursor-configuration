export class Product {
  constructor(
    private _id: string,
    private _name: string,
    private _price: number
  ) {}

  id(): string {
    return this._id;
  }

  name(): string {
    return this._name;
  }

  price(): number {
    return this._price;
  }
} 