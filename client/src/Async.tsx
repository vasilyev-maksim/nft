import * as React from 'react';
import { IAsyncData } from './hooks';

export interface IProps<T> {
  data: IAsyncData<T>;
  /**
   * If some of dependencies change rerender will occur.
   * Needed when you reference some outter scope variables in render props.
   * For example, `successRender` uses `state.counter` value. If you won't specify.
   */
  deps: unknown[];
  successRender?: (data: T, status: IAsyncData<T>['status']) => JSX.Element | null;
  errorRender?: (error: string) => JSX.Element | null;
  initialRender?: () => JSX.Element | null;
  initialLoadingRender?: () => JSX.Element | null;
  loadingRender?: (data?: T) => JSX.Element | null;
  elseRender?: (branch: IAsyncData<T>) => JSX.Element | null;
}

export class Async<T> extends React.Component<IProps<T>> {
  public shouldComponentUpdate(nextProps: IProps<T>): boolean {
    return nextProps.data !== this.props.data || !deepEqual(this.props.deps, nextProps.deps);
  }

  public render(): React.ReactNode {
    const { data, successRender, errorRender, initialRender, initialLoadingRender, loadingRender, elseRender } =
      this.props;

    let result = null;

    if (successRender && data.status === 'success') {
      result = successRender(data.data, 'success');
    } else if (errorRender && data.status === 'error') {
      result = errorRender(data.error);
    } else if (initialRender && data.status === 'initial') {
      result = initialRender();
    } else if ((initialLoadingRender || loadingRender) && data.status === 'loading' && data.initial === true) {
      result = (initialLoadingRender || loadingRender)?.();
    } else if (
      (loadingRender || successRender) &&
      data.status === 'loading' &&
      data.initial === false &&
      data.data !== null &&
      data.data !== undefined
    ) {
      result = (loadingRender || successRender)?.(data.data, 'loading');
    } else if (elseRender) {
      result = elseRender(data);
    }

    return result;
  }
}

function deepEqual<T>(x: T, y: T): boolean {
  if (x === y) {
    return true;
  } else if (
    typeof x === 'object' &&
    (x !== null || x !== undefined) &&
    typeof y === 'object' &&
    (y !== null || y !== undefined)
  ) {
    if (Object.keys(x).length !== Object.keys(y).length) return false;

    for (const prop in x) {
      if (Object.prototype.hasOwnProperty.call(y, prop)) {
        if (!deepEqual(x[prop], y[prop])) return false;
      } else return false;
    }

    return true;
  } else return false;
}
