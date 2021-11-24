export class JsonParseError extends Error {
  constructor(
    public property: string,
    public errorType: ErrorType
    )
    {
      super();
    }
}

export enum ErrorType {
  Missing,
  Invalid
}
