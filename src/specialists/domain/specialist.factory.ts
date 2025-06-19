import { Specialist } from './specialist';

export class SpecialistFactory {
  static toDto(specialist: Specialist | null) {
    if (!specialist) {
      return null;
    }

    return {
      id: specialist.id,
      name: specialist.name,
      type: specialist.type,
    };
  }
}
