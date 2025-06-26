import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity('shopping_carts')
export class ShoppingCartEntity {
  @PrimaryColumn('text')
  id: string;

  @Column('text')
  user_id: string;
} 