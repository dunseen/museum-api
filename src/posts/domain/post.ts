import { NullableType } from '../../utils/types/nullable.type';
import { User } from '../../users/domain/user';
import { Specie } from '../../species/domain/specie';
import { PostBuilder } from './post.builder';
import { ChangeRequest } from 'src/change-requests/domain/change-request';

export class Post {
  private readonly _id?: string;
  private readonly _changeRequest: ChangeRequest;
  private readonly _author: User;
  private readonly _validator: NullableType<User>;
  private readonly _specie: Specie;
  private readonly _createdAt: Date;
  private _updatedAt: Date;

  private constructor(builder: PostBuilder) {
    this._id = builder.id;

    if (builder.changeRequest) {
      this._changeRequest = builder.changeRequest;
      this._author = builder.changeRequest.proposedBy;
      this._validator = builder.changeRequest.reviewedBy;
    }

    this._specie = builder.specie;
    this._createdAt = builder.createdAt;
    this._updatedAt = builder.updatedAt;

    this.validateState();
  }
  static createFromBuilder(builder: PostBuilder): Post {
    return new Post(builder);
  }

  static builder(): PostBuilder {
    return new PostBuilder();
  }

  get id(): string {
    return String(this._id);
  }

  get changeRequest(): NullableType<ChangeRequest> {
    return this._changeRequest;
  }

  get author(): User {
    return this._author;
  }

  get validator(): NullableType<User> {
    return this._validator;
  }

  get specie(): Specie {
    return this._specie;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  private validateState() {
    if (this._id && typeof this._id !== 'string') {
      throw new Error('Post ID is required and must be a string');
    }

    if (!this._specie) {
      throw new Error('Post specie is required');
    }

    if (!this._createdAt) {
      throw new Error('Post createdAt is required');
    }

    if (!this._updatedAt) {
      throw new Error('Post updatedAt is required');
    }
  }
}
