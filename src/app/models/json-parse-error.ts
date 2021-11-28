export class JsonParseError extends Error {
  constructor(
    public property: string,
    public expectedType: string,
    public errorType: ErrorType,
    public data: any
    )
    {
      super();

      this.message = ` value for property "${this.property}": expected type "${this.expectedType}".`;
      this.message = this.errorType === ErrorType.Invalid
        ? "Invalid" + this.message
        : "Missing" + this.message;
    }
}

export enum ErrorType {
  Missing,
  Invalid
}
