import * as React from 'react';
import { ICollectionConfig } from 'shared';

export function useToggleState(initialValue = false) {
  const [state, setState] = React.useState(initialValue);

  return {
    state,
    setOn: React.useCallback(() => setState(true), []),
    setOff: React.useCallback(() => setState(false), []),
    toggle: React.useCallback(() => setState(x => !x), []),
  };
}

export const CollectionsContext = React.createContext<{
  selectedCollection: string;
  collections: string[];
  selectCollection: (collection: string) => void;
}>(null as any);
export function useCollection() {
  return React.useContext(CollectionsContext);
}

export const SelectedCollectionContext = React.createContext<{
  collectionConfig: ICollectionConfig;
}>(null as any);
export function useSelectedCollection() {
  return React.useContext(SelectedCollectionContext);
}
