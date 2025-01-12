import { SpecieMapper } from '../../../../../species/infrastructure/persistence/relational/mappers/specie.mapper';
import { UserMapper } from '../../../../../users/infrastructure/persistence/relational/mappers/user.mapper';
import { Post } from '../../../../domain/post';
import { PostEntity } from '../entities/post.entity';

export class PostMapper {
  static toDomain(raw: PostEntity): Post {
    return Post.builder()
      .setId(raw.id)
      .setRejectReason(raw.reject_reason)
      .setStatus(raw.status)
      .setSpecie(SpecieMapper.toDomain(raw.specie))
      .setAuthor(UserMapper.toDomain(raw.author))
      .setValidator(raw.validator ? UserMapper.toDomain(raw.validator) : null)
      .setCreatedAt(raw.createdAt)
      .setUpdatedAt(raw.updatedAt)
      .build();
  }

  static toPersistence(domainEntity: Partial<Post>): PostEntity {
    const persistenceEntity = new PostEntity();
    if (domainEntity.id) {
      persistenceEntity.id = domainEntity.id;
    }

    if (domainEntity?.specie) {
      persistenceEntity.specie = SpecieMapper.toPersistence(
        domainEntity.specie,
      );
    }

    if (domainEntity?.author) {
      persistenceEntity.author = UserMapper.toPersistence(domainEntity.author);
    }

    if (domainEntity.validator) {
      persistenceEntity.validator = UserMapper.toPersistence(
        domainEntity.validator,
      );
    }

    if (domainEntity.status) {
      persistenceEntity.status = domainEntity.status;
    }

    persistenceEntity.reject_reason = domainEntity.rejectReason ?? null;

    return persistenceEntity;
  }
}
