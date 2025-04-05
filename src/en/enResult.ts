export class EnumResult {
  public id: number;
  public value: number;
  public description: string;
  public detail: string;

  // TODO: add request

  constructor(id: number, value: number, description: string, detail: string) {
    this.id = id;
    this.value = value;
    this.description = description;
    this.detail = detail;
  }
}
