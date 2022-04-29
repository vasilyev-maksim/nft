import * as React from 'react';
import { useInfiniteQuery } from 'react-query';
import { useVirtual } from 'react-virtual';
import { getRandomImages } from './api';
import { CollectionSelector } from './CollectionSelector';
import { useCollection } from './hooks';
import { Image } from './Image';
import { Loader } from './Loader';
import { Iid } from 'shared';

export const VariantsFeed: React.FC<{
  onSelect: (val: Iid) => void;
  selected?: Iid;
}> = ({ selected, onSelect }) => {
  const { selectedCollection } = useCollection();
  const { status, data, isFetchingNextPage, fetchNextPage, hasNextPage } = useInfiniteQuery(
    ['random', selectedCollection],
    () => getRandomImages(5, selectedCollection),
    {
      getNextPageParam: () => 1,
      refetchOnMount: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
    },
  );
  const variants = data?.pages.flatMap(x => x) ?? [];
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
      <div className='mb-1'>
        <CollectionSelector />
      </div>

      <div ref={parentRef} className={`h-full w-[305px] overflow-auto`}>
        <div style={{ height: `${rowVirtualizer.totalSize}px` }} className='w-full relative'>
          {rowVirtualizer.virtualItems.map(virtualRow => {
            const isLoaderRow = virtualRow.index > variants.length - 1;
            const v = new Iid(variants[virtualRow.index]);

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
                  <Image
                    className='rounded-lg overflow-hidden cursor-pointer'
                    active={selected?.id === v.id}
                    iid={v}
                    size={300}
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
