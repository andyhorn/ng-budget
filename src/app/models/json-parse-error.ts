export class JsonParseError extends Error {
  constructor(
    public property: string,
    public errorType: ErrorType,
    public data: any
    )
    {
      super();

      this.message = this.errorType == ErrorType.Invalid
        ? `Invalid value for property "${this.property}": ${this.data}`
        : `Missing value for property "${this.property}": ${this.data}`;
    }
}

export enum ErrorType {
  Missing,
  Invalid
}
