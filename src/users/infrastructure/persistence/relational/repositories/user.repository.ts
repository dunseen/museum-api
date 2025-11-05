import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import { UserEntity } from '../entities/user.entity';
import { NullableType } from '../../../../../utils/types/nullable.type';
import { FilterUserDto, SortUserDto } from '../../../../dto/query-user.dto';
import { User } from '../../../../domain/user';
import { UserRepository } from '../../user.repository';
import { UserMapper } from '../mappers/user.mapper';
import {
  IPaginationOptions,
  WithCountList,
} from '../../../../../utils/types/pagination-options';

@Injectable()
export class UsersRelationalRepository implements UserRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
  ) {}

  async create(data: User): Promise<User> {
    const persistenceModel = UserMapper.toPersistence(data);
    const newEntity = await this.usersRepository.save(
      this.usersRepository.create(persistenceModel),
    );
    return UserMapper.toDomain(newEntity);
  }

  async findManyWithPagination({
    filterOptions,
    sortOptions,
    paginationOptions,
  }: {
    filterOptions?: FilterUserDto | null;
    sortOptions?: SortUserDto[] | null;
    paginationOptions: IPaginationOptions;
  }): Promise<WithCountList<User>> {
    const query = this.usersRepository.createQueryBuilder('u');
    query.innerJoinAndSelect('u.role', 'role');
    query.innerJoinAndSelect('u.status', 'status');

    // Apply filters
    if (filterOptions?.email) {
      query.andWhere('LOWER(u.email) LIKE LOWER(:email)', {
        email: `%${filterOptions.email}%`,
      });
    }

    if (filterOptions?.roles?.length) {
      query.andWhere('role IN (:...roleIds)', {
        roleIds: filterOptions.roles.map((role) => role.id),
      });
    }

    // Apply sorting
    if (sortOptions?.length) {
      sortOptions.forEach((sort) => {
        query.addOrderBy(
          `u.${sort.orderBy}`,
          sort.order.toUpperCase() as 'ASC' | 'DESC',
        );
      });
    } else {
      // Default sorting
      query.addOrderBy('u.createdAt', 'DESC');
    }

    // Apply pagination
    query.skip((paginationOptions.page - 1) * paginationOptions.limit);
    query.take(paginationOptions.limit);

    // Execute query
    const [entities, totalCount] = await query.getManyAndCount();

    return [entities.map((user) => UserMapper.toDomain(user)), totalCount];
  }

  async findById(id: User['id']): Promise<NullableType<User>> {
    const entity = await this.usersRepository.findOne({
      where: { id },
      relations: ['role', 'status'],
    });

    return entity ? UserMapper.toDomain(entity) : null;
  }

  async findByEmail(email: User['email']): Promise<NullableType<User>> {
    if (!email) return null;

    const entity = await this.usersRepository.findOne({
      where: { email },
    });

    return entity ? UserMapper.toDomain(entity) : null;
  }

  async update(id: User['id'], payload: Partial<User>): Promise<User> {
    const entity = await this.usersRepository.findOne({
      where: { id },
    });

    if (!entity) {
      throw new Error('User not found');
    }

    const updatedEntity = await this.usersRepository.save(
      this.usersRepository.create(
        UserMapper.toPersistence({
          id,
          ...payload,
        }),
      ),
    );

    return UserMapper.toDomain(updatedEntity);
  }

  async remove(id: User['id']): Promise<void> {
    await this.usersRepository.softDelete(id);
  }
}
