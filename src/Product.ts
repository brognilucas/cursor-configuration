export class Product {
  constructor(
    private _id: number,
    private _name: string,
    private _price: number
  ) {}

  id(): number {
    return this._id;
  }

  name(): string {
    return this._name;
  }

  price(): number {
    return this._price;
  }
} 