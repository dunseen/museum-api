import { Injectable } from '@nestjs/common';
import { StateRepository } from './infrastructure/persistence/state.repository';

@Injectable()
export class StatesService {
  constructor(private readonly stateRepository: StateRepository) {}

  findAll() {
    return this.stateRepository.findAll();
  }
}
