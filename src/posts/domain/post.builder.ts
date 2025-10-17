import { ChangeRequest } from 'src/change-requests/domain/change-request';
import { Specie } from '../../species/domain/specie';
import { Post } from './post';
import { randomUUID } from 'crypto';
import { NullableType } from 'src/utils/types/nullable.type';

export class PostBuilder {
  id?: string;
  changeRequest: NullableType<ChangeRequest> = null;
  specie!: Specie;
  createdAt: Date = new Date();
  updatedAt: Date = new Date();

  setId(id?: string): this {
    this.id = id ?? randomUUID();
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

  setChangeRequest(changeRequest: NullableType<ChangeRequest>): this {
    this.changeRequest = changeRequest;
    return this;
  }

  build(): Post {
    return Post.createFromBuilder(this);
  }
}
