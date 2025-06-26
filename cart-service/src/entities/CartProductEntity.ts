import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { ShoppingCartEntity } from './ShoppingCartEntity';
import { ProductEntity } from './ProductEntity';

@Entity('cart_products')
export class CartProductEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  cart_id: string;

  @Column('text')
  product_id: string;

  @Column('int')
  quantity: number;

  @ManyToOne(() => ShoppingCartEntity)
  @JoinColumn({ name: 'cart_id' })
  cart: ShoppingCartEntity;

  @ManyToOne(() => ProductEntity)
  @JoinColumn({ name: 'product_id' })
  product: ProductEntity;
} 