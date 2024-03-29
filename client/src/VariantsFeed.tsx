import * as React from 'react';
import { useInfiniteQuery } from 'react-query';
import { useVirtual } from 'react-virtual';
// import { getRandomImages } from './api';
import { CollectionSelector } from './CollectionSelector';
import { useCollection, useSelectedCollection } from './hooks';
// import { Image } from './Image';
import { Loader } from './Loader';
import * as shared from 'shared';
import { SvgImage } from './SvgImage';

function getRandomImages(count: number, collectionConfig: shared.ICollectionConfig): Promise<shared.Iid[]> {
  return Promise.resolve(
    Array.from({ length: count }, () => {
      const layers = collectionConfig.categories
        .map(x => {
          return Math.random() <= x.probability ? x.layers[Math.floor(Math.random() * x.layers.length)] : null;
        })
        .filter(Boolean) as shared.Layer[];
      const iid = new shared.IidBuilder(1, layers, collectionConfig.name).build(); // TODO: '1' is hardcoded
      return iid;
    }),
  );
}

export const VariantsFeed: React.FC<{
  onSelect: (val: shared.Iid) => void;
  selected?: shared.Iid;
}> = ({ selected, onSelect }) => {
  const { selectedCollection, collections } = useCollection();
  const { collectionConfig } = useSelectedCollection();
  const { status, data, isFetchingNextPage, fetchNextPage, hasNextPage } = useInfiniteQuery(
    ['random', collectionConfig],
    // ['random', selectedCollection],
    () => getRandomImages(5, collectionConfig),
    {
      getNextPageParam: () => 1,
      refetchOnMount: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
    },
  );
  const variants = data?.pages.flatMap(p => p) ?? [];

  const parentRef = React.useRef<HTMLTableElement>(null);
  const rowVirtualizer = useVirtual({
    size: hasNextPage ? variants.length + 1 : variants.length,
    parentRef,
    estimateSize: React.useCallback(() => 305, []),
  });

  React.useEffect(() => {
    const lastItem = rowVirtualizer.virtualItems[rowVirtualizer.virtualItems.length - 1];
    if (lastItem && lastItem.index >= variants.length - 1 && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, fetchNextPage, variants.length, isFetchingNextPage, rowVirtualizer.virtualItems]);

  return status === 'success' ? (
    <>
      {collections.length > 1 && (
        <div className='mb-1'>
          <CollectionSelector />
        </div>
      )}

      <div ref={parentRef} className={`h-full w-[305px] overflow-auto`}>
        <div style={{ height: `${rowVirtualizer.totalSize}px` }} className='w-full relative'>
          {rowVirtualizer.virtualItems.map(virtualRow => {
            const isLoaderRow = virtualRow.index > variants.length - 1;
            const v = variants[virtualRow.index];

            return (
              <div
                key={virtualRow.index}
                onClick={() => onSelect(v)}
                className='absolute top-0 left-0 w-full flex justify-center items-center'
                style={{
                  height: `${virtualRow.size}px`,
                  transform: `translateY(${virtualRow.start}px)`,
                }}>
                {isLoaderRow ? (
                  <>{hasNextPage ? 'Loading more...' : 'Nothing more to load'}</>
                ) : (
                  <SvgImage
                    className='rounded-md overflow-hidden cursor-pointer'
                    active={selected?.id === v.id}
                    iid={v}
                    size={300}
                    key={v.id}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </>
  ) : (
    <Loader />
  );
};
