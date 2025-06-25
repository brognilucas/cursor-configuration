import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity('users')
export class UserEntity {
  @PrimaryColumn()
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  name: string;

  @Column()
  password: string;
} 