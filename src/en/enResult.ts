export class EnumResult {
  public id: number;
  public value: number;
  public description: string;
  public detail: string;
  public request: string;

  constructor(
    id: number,
    value: number,
    description: string,
    detail: string,
    request: string
  ) {
    this.id = id;
    this.value = value;
    this.description = description;
    this.detail = detail;
    this.request = request;
  }
}
