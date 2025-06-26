import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { ShoppingCartEntity } from './ShoppingCartEntity';

@Entity('cart_items')
export class CartItemEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  cart_id: string;

  @Column('text')
  product_id: string;

  @Column('int')
  quantity: number;

  @ManyToOne(() => ShoppingCartEntity, cart => cart.cartItems)
  @JoinColumn({ name: 'cart_id' })
  cart: ShoppingCartEntity;
} 