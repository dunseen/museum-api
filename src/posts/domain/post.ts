import { NullableType } from '../../utils/types/nullable.type';
import { PostStatusEnum } from '../post-status.enum';
import { User } from '../../users/domain/user';
import { Specie } from '../../species/domain/specie';
import { PostBuilder } from './post.builder';

export class Post {
  private readonly _id?: string;
  private _status: PostStatusEnum;
  private _rejectReason: NullableType<string>;
  private readonly _author: User;
  private _validator: NullableType<User>;
  private readonly _specie: Specie;
  private readonly _createdAt: Date;
  private _updatedAt: Date;

  private constructor(builder: PostBuilder) {
    this._id = builder.id;
    this._status = builder.status;
    this._rejectReason = builder.rejectReason;
    this._author = builder.author;
    this._validator = builder.validator;
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

  get status(): PostStatusEnum {
    return this._status;
  }

  get rejectReason(): NullableType<string> {
    return this._rejectReason;
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

  updateStatus(
    newStatus: PostStatusEnum,
    validator: User,
    rejectReason?: NullableType<string>,
  ): void {
    if (newStatus === PostStatusEnum.rejected && !rejectReason) {
      throw new Error('Reject reason must be provided for rejected posts');
    }

    this._status = newStatus;
    this._validator = validator;
    this._rejectReason = rejectReason ?? this._rejectReason;
    this._updatedAt = new Date();
  }

  private validateState() {
    if (this._id && typeof this._id !== 'string') {
      throw new Error('Post ID is required and must be a string');
    }

    if (!this._status) {
      throw new Error('Post status is required');
    }

    if (!this._author) {
      throw new Error('Post author is required');
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
