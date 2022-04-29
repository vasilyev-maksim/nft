import * as React from 'react';

export function useForceRerender() {
  const { state, toggle } = useToggleState();
  return [state, toggle] as const;
}

export function useStopPropogationCallback(fn?: () => void) {
  return React.useCallback(
    (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
      e.stopPropagation();
      fn?.();
    },
    [fn],
  );
}

export function useToggleState(initialValue = false) {
  const [state, setState] = React.useState(initialValue);

  return {
    state,
    setOn: React.useCallback(() => setState(true), []),
    setOff: React.useCallback(() => setState(false), []),
    toggle: React.useCallback(() => setState(x => !x), []),
  };
}

export type IAsyncData<T> =
  | { status: 'initial' }
  | { status: 'loading'; initial: true }
  | { status: 'loading'; initial: false; data: T | undefined }
  | { status: 'success'; data: T }
  | { status: 'error'; error: string };

// TODO: comment
export function useAsyncData<T>(initialData?: T) {
  const [asyncData, setAsyncData] = React.useState<IAsyncData<T>>(
    initialData !== undefined ? { status: 'success', data: initialData } : { status: 'initial' },
  );
  const lastRequestMeta = React.useRef<{ id: number; tag: string | number | undefined } | null>();
  const promisesDictByTags = React.useRef<Record<string, Promise<T>>>({});
  const requestCounter = React.useRef(0);

  function initAsyncData(
    fetcher: () => Promise<T>,
    options: { useCache?: boolean; tag?: string | number } = { useCache: false },
  ): Promise<T> {
    const dataFetched =
      asyncData.status === 'success' ||
      (asyncData.status === 'loading' && asyncData.initial === false && asyncData.data !== null);
    const requestShouldBeMade =
      lastRequestMeta.current?.tag !== options.tag || !options.useCache || (options.useCache && !dataFetched);
    const tag = options.tag ?? '__DEFAULT__';

    if (requestShouldBeMade) {
      if (!options.useCache || !promisesDictByTags.current[tag]) {
        setAsyncData(x =>
          x.status === 'initial' || (x.status === 'loading' && x.initial)
            ? {
                initial: true,
                status: 'loading',
              }
            : {
                data: x.status !== 'error' ? x.data : undefined,
                initial: false,
                status: 'loading',
              },
        );
        promisesDictByTags.current[tag] = fetcher();
      }

      lastRequestMeta.current = { id: requestCounter.current++, tag: options.tag };

      return promisesDictByTags.current[tag]
        .then(
          (requestMeta => {
            return data => {
              if (
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                requestMeta.id === lastRequestMeta.current!.id &&
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                requestMeta.tag === lastRequestMeta.current!.tag
              ) {
                setAsyncData(() => ({ data, status: 'success' }));
              }
              return data;
            };
          })(lastRequestMeta.current),
        )
        .catch(
          (requestMeta => {
            return error => {
              if (
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                requestMeta.id === lastRequestMeta.current!.id &&
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                requestMeta.tag === lastRequestMeta.current!.tag
              ) {
                setAsyncData(() => ({ error, status: 'error' }));
              }
              throw error;
            };
          })(lastRequestMeta.current),
        );
    }

    return promisesDictByTags.current[tag];
  }

  return [asyncData, initAsyncData, setAsyncData] as const;
}

export const CollectionContext = React.createContext<{
  selectedCollection: string;
  collections: string[];
  selectCollection: (collection: string) => void;
}>(null as any);
export function useCollection() {
  return React.useContext(CollectionContext);
}
