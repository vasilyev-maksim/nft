import * as React from 'react';

export function useToggleState(initialValue = false) {
  const [state, setState] = React.useState(initialValue);

  return {
    state,
    setOn: React.useCallback(() => setState(true), []),
    setOff: React.useCallback(() => setState(false), []),
    toggle: React.useCallback(() => setState(x => !x), []),
  };
}

export const CollectionContext = React.createContext<{
  selectedCollection: string;
  collections: string[];
  selectCollection: (collection: string) => void;
}>(null as any);
export function useCollection() {
  return React.useContext(CollectionContext);
}
