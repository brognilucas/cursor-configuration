import { v4 as uuid } from 'uuid';
import { ShoppingCartRepository } from '../repositories/ShoppingCartRepository';
import { CartItem } from '../dto/CartItem';

export class ShoppingCart {
  private _id: string;
  private _items: CartItem[] = [];

  constructor(private readonly _repository: ShoppingCartRepository, id?: string) {
    this._id = id ?? uuid();
  }

  async addProduct(productId: string, quantity: number, userId: string): Promise<void> {
    const cartData = await this._repository.load(this._id, userId);
    this._items = cartData.items;
    
    const existingItem = this._items.find(item => item.productId === productId);
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      this._items.push({ productId, quantity });
    }
    
    await this._repository.save(this, this._items, userId);
  }

  async listItems(userId: string): Promise<CartItem[]> {
    const cartData = await this._repository.load(this._id, userId);
    this._items = cartData.items;
    return [...this._items];
  }

  id(): string {
    return this._id;
  }

  async save(userId: string): Promise<void> {
    await this._repository.save(this, this._items, userId);
  }

  setItems(items: CartItem[]): void {
    this._items = items;
  }
} 