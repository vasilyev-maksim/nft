import * as React from 'react';
import { useCollection } from './hooks';
import { Selector } from './Selector';

export const CollectionSelector: React.FC = () => {
  const { selectedCollection, selectCollection, collections } = useCollection();
  const items = React.useMemo(() => collections.map(x => ({ value: x, body: x, key: x })), [collections]);
  return <Selector<string> items={items} value={selectedCollection} onSelect={selectCollection} />;
};
