import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity('products')
export class ProductEntity {
  @PrimaryColumn('text')
  id: string;

  @Column('text')
  name: string;

  @Column('decimal')
  price: number;
} 