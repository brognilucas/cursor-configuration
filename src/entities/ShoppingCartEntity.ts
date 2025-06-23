import { Entity, PrimaryColumn, Column } from 'typeorm';

interface StoredProduct {
  id: number;
  name: string;
  price: number;
}

@Entity('shopping_carts')
export class ShoppingCartEntity {
  @PrimaryColumn('text')
  id: string;

  @Column('jsonb')
  products: StoredProduct[];
} 