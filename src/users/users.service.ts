import {
  HttpStatus,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { NullableType } from '../utils/types/nullable.type';
import { FilterUserDto, SortUserDto } from './dto/query-user.dto';
import { UserRepository } from './infrastructure/persistence/user.repository';
import { ChangeLogsService } from '../change-logs/change-logs.service';
import { JwtPayloadType } from '../auth/strategies/types/jwt-payload.type';
import { User } from './domain/user';
import bcrypt from 'bcryptjs';
import { AuthProvidersEnum } from '../auth/auth-providers.enum';
import { RoleEnum } from '../roles/roles.enum';
import { StatusEnum } from '../statuses/statuses.enum';
import {
  IPaginationOptions,
  WithCountList,
} from '../utils/types/pagination-options';
import { DeepPartial } from '../utils/types/deep-partial.type';
import { UserNotFoundException } from './domain/exceptions/user-not-found.error';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UserRepository,
    private readonly changeLogsService: ChangeLogsService,
  ) {}

  async create(
    createProfileDto: CreateUserDto,
    payload?: JwtPayloadType,
  ): Promise<User> {
    const clonedPayload = {
      provider: AuthProvidersEnum.email,
      ...createProfileDto,
    };

    if (clonedPayload.email) {
      const userObject = await this.usersRepository.findByEmail(
        clonedPayload.email,
      );
      if (userObject) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            email: 'emailAlreadyExists',
          },
        });
      }
    }

    if (clonedPayload.role?.id) {
      const roleObject = Object.values(RoleEnum)
        .map(String)
        .includes(String(clonedPayload.role.id));
      if (!roleObject) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            role: 'roleNotExists',
          },
        });
      }
    }

    if (clonedPayload.status?.id) {
      const statusObject = Object.values(StatusEnum)
        .map(String)
        .includes(String(clonedPayload.status.id));
      if (!statusObject) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            status: 'statusNotExists',
          },
        });
      }
    }

    const createdUser = await this.usersRepository.create(clonedPayload);

    if (payload) {
      const changer = await this.usersRepository.findById(payload.id);
      if (changer) {
        await this.changeLogsService.create({
          tableName: 'user',
          action: 'create',
          oldValue: null,
          newValue: createdUser,
          changedBy: changer,
        });
      }
    }

    return createdUser;
  }

  findManyWithPagination({
    filterOptions,
    sortOptions,
    paginationOptions,
  }: {
    filterOptions?: FilterUserDto | null;
    sortOptions?: SortUserDto[] | null;
    paginationOptions: IPaginationOptions;
  }): Promise<WithCountList<User>> {
    return this.usersRepository.findManyWithPagination({
      filterOptions,
      sortOptions,
      paginationOptions,
    });
  }

  findById(id: User['id']): Promise<NullableType<User>> {
    return this.usersRepository.findById(id);
  }

  async ensureUserExists(id: User['id']) {
    const user = await this.findById(id);

    if (!user) {
      throw new UserNotFoundException(id);
    }

    return user;
  }

  findByEmail(email: User['email']): Promise<NullableType<User>> {
    return this.usersRepository.findByEmail(email);
  }

  async update(
    id: User['id'],
    payload: DeepPartial<User>,
    jwtPayload?: JwtPayloadType,
  ): Promise<User | null> {
    const clonedPayload = { ...payload };

    if (
      clonedPayload.password &&
      clonedPayload.previousPassword !== clonedPayload.password
    ) {
      const salt = await bcrypt.genSalt();
      clonedPayload.password = await bcrypt.hash(clonedPayload.password, salt);
    }

    if (clonedPayload.email) {
      const userObject = await this.usersRepository.findByEmail(
        clonedPayload.email,
      );

      if (userObject && userObject.id !== id) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            email: 'emailAlreadyExists',
          },
        });
      }
    }

    if (clonedPayload.role?.id) {
      const roleObject = Object.values(RoleEnum)
        .map(String)
        .includes(String(clonedPayload.role.id));
      if (!roleObject) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            role: 'roleNotExists',
          },
        });
      }
    }

    if (clonedPayload.status?.id) {
      const statusObject = Object.values(StatusEnum)
        .map(String)
        .includes(String(clonedPayload.status.id));
      if (!statusObject) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            status: 'statusNotExists',
          },
        });
      }
    }

    const oldUser = await this.usersRepository.findById(id);
    const updatedUser = await this.usersRepository.update(id, clonedPayload);

    if (jwtPayload) {
      const changer = await this.usersRepository.findById(jwtPayload.id);
      if (changer) {
        await this.changeLogsService.create({
          tableName: 'user',
          action: 'update',
          oldValue: oldUser,
          newValue: updatedUser,
          changedBy: changer,
        });
      }
    }

    return updatedUser;
  }

  async remove(id: User['id'], jwtPayload?: JwtPayloadType): Promise<void> {
    const user = await this.usersRepository.findById(id);
    await this.usersRepository.remove(id);

    if (jwtPayload && user) {
      const changer = await this.usersRepository.findById(jwtPayload.id);
      if (changer) {
        await this.changeLogsService.create({
          tableName: 'user',
          action: 'delete',
          oldValue: user,
          newValue: null,
          changedBy: changer,
        });
      }
    }
  }
}
