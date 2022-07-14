import classNames from 'classnames';
import * as React from 'react';
import { CollectionContext } from './hooks';
import { LayersToolbar } from './LayersToolbar';
import { Iid } from 'shared';
import { Preview } from './Preview';
import { VariantsFeed } from './VariantsFeed';

export const App: React.FC<{ collections: string[] }> = ({ collections }) => {
  const [iid, setIid] = React.useState<Iid | undefined>();
  const savedCollectionChoice = localStorage.getItem('collection');
  const [collection, setCollection] = React.useState(
    savedCollectionChoice && collections.includes(savedCollectionChoice) ? savedCollectionChoice : collections[0],
  );
  const collectionContextValue = React.useMemo(() => {
    return {
      selectedCollection: collection,
      selectCollection: setCollection,
      collections,
    };
  }, [collections, collection]);

  React.useEffect(() => {
    localStorage.setItem('collection', collection);
  }, [collection]);

  React.useEffect(() => setIid(undefined), [collection]);

  return (
    <CollectionContext.Provider value={collectionContextValue}>
      <div className='flex flex-row font-mono max-w-[100vw] max-h-[100vh] overflow-hidden'>
        <Section header='Random variants' className='shrink-0'>
          <VariantsFeed selected={iid} onSelect={setIid} />
        </Section>
        {iid ? (
          <>
            <Section header='Preview' className='shrink-0'>
              <Preview iid={iid} />
            </Section>

            <Section header='Layers' className='min-w-[360px] flex-1'>
              <LayersToolbar selected={iid} onSelect={setIid} />
            </Section>
          </>
        ) : (
          <span className='text-sm text-gray-500 m-auto text-center'>
            Select one of the random variants as a base image for the further customizing
          </span>
        )}
      </div>
    </CollectionContext.Provider>
  );
};

export const Section: React.FC<React.HTMLAttributes<HTMLDivElement> & { header: string }> = ({
  header,
  children,
  className,
}) => {
  return (
    <div className={classNames('flex flex-col m-2', className)}>
      <header className='mb-2'>{header}</header>
      <div className='grow overflow-scroll'>{children}</div>
    </div>
  );
};
