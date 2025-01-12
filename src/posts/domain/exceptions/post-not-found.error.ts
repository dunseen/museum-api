export class PostNotFoundException extends Error {
  constructor(id: string) {
    super(`Post with ID ${id} not found.`);
    this.name = 'PostNotFoundException';
  }
}
