import { Entity, PrimaryColumn, Column, OneToMany } from 'typeorm';
import { CartItemEntity } from './CartItemEntity';

@Entity('shopping_carts')
export class ShoppingCartEntity {
  @PrimaryColumn('text')
  id: string;

  @Column('text')
  user_id: string;

  @OneToMany(() => CartItemEntity, cartItem => cartItem.cart)
  cartItems: CartItemEntity[];
} 