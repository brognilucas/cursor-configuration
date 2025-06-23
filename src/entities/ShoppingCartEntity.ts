import { Entity, PrimaryColumn } from 'typeorm';

@Entity('shopping_carts')
export class ShoppingCartEntity {
  @PrimaryColumn('text')
  id: string;
} 