import classNames from 'classnames';
import * as React from 'react';
// import { useQuery } from 'react-query';
// import { getPreviewUrl } from './api';
import * as shared from 'shared';
import { useSelectedCollection } from './hooks';

export const SvgImage: React.FC<
  React.HTMLAttributes<HTMLDivElement> & {
    iid: shared.Iid;
    size: number;
    active?: boolean;
  }
> = ({ iid, size, className, active = false, ...props }) => {
  const { collectionConfig } = useSelectedCollection();
  // const [loading, setLoading] = React.useState(true);
  // const { data, isLoading } = useQuery(['preview', iid.id], () => preview(iid), {
  //   enabled: !!iid,
  //   staleTime: Infinity,
  //   cacheTime: Infinity,
  // });
  const __html = React.useMemo(() => {
    const body = collectionConfig.categories
      .flatMap(c => c.layers)
      .filter(x => iid.layers.some(l => l.id === x.id))
      .reduce((acc, x) => acc + (x as any).svg, '');
    return `<svg width=${size} height=${size} viewBox="0 0 1660 1660" fill="none" xmlns="http://www.w3.org/2000/svg">
      ${body}
    </svg>`;
  }, []);

  return (
    <div
      {...props}
      className={classNames(className, {
        'ring-blue-400 ring': active,
      })}>
      <div {...(__html ? { dangerouslySetInnerHTML: { __html } } : {})} />
    </div>
  );
};
