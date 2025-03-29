import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RoleEntity } from '../../../../roles/infrastructure/persistence/relational/entities/role.entity';
import { RoleEnum } from '../../../../roles/roles.enum';

@Injectable()
export class RoleSeedService {
  constructor(
    @InjectRepository(RoleEntity)
    private repository: Repository<RoleEntity>,
  ) {}

  async run() {
    const countAdmin = await this.repository.count({
      where: {
        id: RoleEnum.admin,
      },
    });

    if (!countAdmin) {
      await this.repository.save(
        this.repository.create({
          id: RoleEnum.admin,
          name: 'ADMIN',
        }),
      );
    }

    const countEditor = await this.repository.count({
      where: {
        id: RoleEnum.editor,
      },
    });

    if (!countEditor) {
      await this.repository.save(
        this.repository.create({
          id: RoleEnum.editor,
          name: 'EDITOR',
        }),
      );
    }

    const countOperator = await this.repository.count({
      where: {
        id: RoleEnum.operator,
      },
    });

    if (!countOperator) {
      await this.repository.save(
        this.repository.create({
          id: RoleEnum.operator,
          name: 'OPERATOR',
        }),
      );
    }
  }
}
