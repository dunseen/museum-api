import { SpecieFactory } from '../../../../../species/domain/specie.factory';
import { SpecieMapper } from '../../../../../species/infrastructure/persistence/relational/mappers/specie.mapper';
import { ListHomePagePostsDto } from '../../../../application/dtos';
import { PostEntity } from '../entities/post.entity';

export class PostSimplifiedMapper {
  static toDomain(raw: PostEntity): ListHomePagePostsDto {
    return {
      id: raw.id,
      specie: SpecieFactory.toListHomePageDto(
        SpecieMapper.toDomain(raw.specie),
      ),
    };
  }
}
