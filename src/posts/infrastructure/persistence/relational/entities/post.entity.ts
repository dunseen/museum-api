import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { EntityRelationalHelper } from '../../../../../utils/relational-entity-helper';
import { NullableType } from '../../../../../utils/types/nullable.type';
import { UserEntity } from '../../../../../users/infrastructure/persistence/relational/entities/user.entity';
import { SpecieEntity } from '../../../../../species/infrastructure/persistence/relational/entities/specie.entity';

@Entity({
  name: 'post',
})
export class PostEntity extends EntityRelationalHelper {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'text',
  })
  status: string;

  @Column({
    type: 'varchar',
    nullable: true,
    length: 255,
  })
  reject_reason: NullableType<string>;

  @ManyToOne(() => UserEntity, { eager: true })
  author: UserEntity;

  @ManyToOne(() => UserEntity, { eager: true })
  validator: NullableType<UserEntity>;

  @ManyToOne(() => SpecieEntity, { eager: true })
  specie: SpecieEntity;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
