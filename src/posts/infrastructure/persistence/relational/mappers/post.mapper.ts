import { SpecieMapper } from '../../../../../species/infrastructure/persistence/relational/mappers/specie.mapper';
import { UserMapper } from '../../../../../users/infrastructure/persistence/relational/mappers/user.mapper';
import { Post } from '../../../../domain/post';
import { PostStatusEnum } from '../../../../post-status.enum';
import { PostEntity } from '../entities/post.entity';

export class PostMapper {
  static toDomain(raw: PostEntity): Post {
    const domainEntity = new Post();
    domainEntity.id = raw.id;
    domainEntity.status = PostStatusEnum[raw.status];
    domainEntity.reject_reason = raw.reject_reason;
    domainEntity.specie = SpecieMapper.toDomain(raw.specie);
    domainEntity.author = UserMapper.toDomain(raw.author);

    domainEntity.validator = raw.validator
      ? UserMapper.toDomain(raw.validator)
      : null;

    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;

    return domainEntity;
  }

  static toPersistence(domainEntity: Post): PostEntity {
    const persistenceEntity = new PostEntity();
    if (domainEntity.id) {
      persistenceEntity.id = domainEntity.id;
    }
    persistenceEntity.specie = SpecieMapper.toPersistence(domainEntity.specie);
    persistenceEntity.author = UserMapper.toPersistence(domainEntity.author);

    if (domainEntity.validator) {
      persistenceEntity.validator = UserMapper.toPersistence(
        domainEntity.validator,
      );
    }

    persistenceEntity.reject_reason = domainEntity.reject_reason;
    persistenceEntity.status = domainEntity.status;
    persistenceEntity.createdAt = domainEntity.createdAt;
    persistenceEntity.updatedAt = domainEntity.updatedAt;

    return persistenceEntity;
  }
}
