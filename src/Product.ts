export class Product {
  constructor(
    private id: number,
    private name: string,
    private price: number
  ) {}

  productId(): number {
    return this.id;
  }

  productName(): string {
    return this.name;
  }

  productPrice(): number {
    return this.price;
  }
} 