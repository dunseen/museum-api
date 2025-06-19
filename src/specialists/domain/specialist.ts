export enum SpecialistType {
  COLLECTOR = 'collector',
  DETERMINATOR = 'determinator',
}

export class Specialist {
  id: string;
  name: string;
  type: SpecialistType;
}
