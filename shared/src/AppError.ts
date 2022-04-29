import { IidSourse } from './Iid';

export class AppError extends Error {
  public constructor(
    message: string,
    public meta: {
      iid?: IidSourse;
      childError?: Error;
    } = {},
  ) {
    super(message);
    this.name = 'AppError';
  }
}
