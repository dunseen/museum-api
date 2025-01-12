import { Specie } from '../../species/domain/specie';
import { User } from '../../users/domain/user';
import { NullableType } from '../../utils/types/nullable.type';
import { PostStatusEnum } from '../post-status.enum';
import { Post } from './post';

export class PostBuilder {
  id?: string;
  status!: PostStatusEnum;
  rejectReason: NullableType<string> = null;
  author!: User;
  validator: NullableType<User> = null;
  specie!: Specie;
  createdAt: Date = new Date();
  updatedAt: Date = new Date();

  setId(id?: string): this {
    this.id = id;
    return this;
  }

  setStatus(status: string): this {
    this.status = PostStatusEnum[status];
    return this;
  }

  setRejectReason(reason: NullableType<string>): this {
    this.rejectReason = reason;
    return this;
  }

  setAuthor(author: User): this {
    this.author = author;
    return this;
  }

  setValidator(validator: NullableType<User>): this {
    this.validator = validator;
    return this;
  }

  setSpecie(specie: Specie): this {
    this.specie = specie;
    return this;
  }

  setCreatedAt(date: Date): this {
    this.createdAt = date;
    return this;
  }

  setUpdatedAt(date: Date): this {
    this.updatedAt = date;
    return this;
  }

  build(): Post {
    return Post.createFromBuilder(this);
  }
}
