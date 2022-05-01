export class AppError extends Error {
  public constructor(
    message: string,
    public meta: {
      source?: any;
      childError?: Error;
    } = {},
  ) {
    super(message);
    this.name = 'AppError';
  }
}
