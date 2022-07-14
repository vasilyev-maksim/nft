import classNames from 'classnames';
import * as React from 'react';
import { useQuery } from 'react-query';
import { preview } from './api';
import { Iid } from 'shared';
import { useCollection } from './hooks';

export const Image: React.FC<React.HTMLAttributes<HTMLDivElement> & { iid: Iid; size: number; active?: boolean }> = ({
  iid,
  size,
  className,
  active = false,
  ...props
}) => {
  const { data, isLoading } = useQuery(['preview', iid.id], () => preview(iid), {
    enabled: !!iid,
    staleTime: Infinity,
    cacheTime: Infinity,
  });
  const { selectedCollection } = useCollection();
  const __html = React.useMemo(() => {
    return isLoading
      ? null
      : data?.text
          ?.replace(data.placeholders.width, size.toString())
          .replace(data.placeholders.height, size.toString());
  }, [isLoading, data, size]);

  return (
    <div
      {...props}
      className={classNames(className, {
        'ring-blue-400 ring': active,
      })}>
      <div className='text-center text-gray-500' style={{ width: size, height: size }}>
        Loading...
      </div>
      {/* {__html ? (
        <div {...(__html ? { dangerouslySetInnerHTML: { __html } } : {})} />
      ) : (
        
      )} */}
    </div>
  );
};
