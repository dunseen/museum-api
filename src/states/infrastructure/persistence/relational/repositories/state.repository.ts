import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StateEntity } from '../entities/state.entity';
import { NullableType } from '../../../../../utils/types/nullable.type';
import { State } from '../../../../domain/state';
import { StateRepository } from '../../state.repository';
import { StateMapper } from '../mappers/state.mapper';

@Injectable()
export class StateRelationalRepository implements StateRepository {
  constructor(
    @InjectRepository(StateEntity)
    private readonly stateRepository: Repository<StateEntity>,
  ) {}

  async create(data: State): Promise<State> {
    const persistenceModel = StateMapper.toPersistence(data);
    const newEntity = await this.stateRepository.save(
      this.stateRepository.create(persistenceModel),
    );
    return StateMapper.toDomain(newEntity);
  }

  async findAll(): Promise<State[]> {
    const states = await this.stateRepository.find();

    return states.map((state) => StateMapper.toDomain(state));
  }

  async findById(id: State['id']): Promise<NullableType<State>> {
    const entity = await this.stateRepository.findOne({
      where: { id },
    });

    return entity ? StateMapper.toDomain(entity) : null;
  }

  async update(id: State['id'], payload: Partial<State>): Promise<State> {
    const entity = await this.stateRepository.findOne({
      where: { id },
    });

    if (!entity) {
      throw new Error('Record not found');
    }

    const updatedEntity = await this.stateRepository.save(
      this.stateRepository.create(
        StateMapper.toPersistence({
          ...StateMapper.toDomain(entity),
          ...payload,
        }),
      ),
    );

    return StateMapper.toDomain(updatedEntity);
  }

  async remove(id: State['id']): Promise<void> {
    await this.stateRepository.delete(id);
  }
}
