import { SpecieMapper } from '../../../../../species/infrastructure/persistence/relational/mappers/specie.mapper';
import { Post } from '../../../../domain/post';
import { PostEntity } from '../entities/post.entity';
import { ChangeRequestMapper } from 'src/change-requests/infrastructure/persistence/relational/mappers/change-request.mapper';

export class PostMapper {
  static toDomain(raw: PostEntity): Post {
    return Post.builder()
      .setId(raw.id)
      .setSpecie(SpecieMapper.toDomain(raw.specie))
      .setCreatedAt(raw.createdAt)
      .setUpdatedAt(raw.updatedAt)
      .setChangeRequest(
        raw.changeRequest
          ? ChangeRequestMapper.toDomain(raw.changeRequest)
          : null,
      )
      .build();
  }

  static toPersistence(domainEntity: Partial<Post>): PostEntity {
    const persistenceEntity = new PostEntity();
    if (domainEntity.id) {
      persistenceEntity.id = domainEntity.id;
    }

    if (domainEntity.specie) {
      persistenceEntity.specie = SpecieMapper.toPersistence(
        domainEntity.specie,
      );
    }

    if (domainEntity.changeRequest) {
      persistenceEntity.changeRequestId = domainEntity.changeRequest.id;
    }

    return persistenceEntity;
  }
}
