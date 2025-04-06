export class EnumResult {
  public id: number;
  public value: number;
  public description: string;
  public detail: string;
  public request: string;
  public isApproximation: boolean;

  constructor(
    id: number,
    value: number,
    description: string,
    detail: string,
    request: string,
    isApproximation?: boolean
  ) {
    this.id = id;
    this.value = value;
    this.description = description;
    this.detail = detail;
    this.request = request;
    this.isApproximation = isApproximation || false;
  }
}
