import classNames from 'classnames';
import * as React from 'react';
import { useQuery } from 'react-query';
import { Iid, IidBuilder, Layer } from 'shared';
import { getCollectionConfig } from './api';
import { useCollection } from './hooks';
import { Image } from './Image';

export const LayersToolbar: React.FC<{
  selected: Iid;
  onSelect: React.Dispatch<React.SetStateAction<Iid | undefined>>;
}> = ({ selected, onSelect }) => {
  const { selectedCollection } = useCollection();
  const { data, isLoading } = useQuery(['config', selectedCollection], () => getCollectionConfig(selectedCollection));
  const [upscale, setUpscale] = React.useState(0);
  const size = 100 * (upscale + 1);

  return isLoading ? (
    <>Loading...</>
  ) : (
    <div>
      <div className='mb-2 text-xs text-gray-500'>
        {upscale * 100}% zoom{' '}
        <input
          type='range'
          min='0'
          max='100'
          step='20'
          value={upscale * 100}
          className='relative top-1'
          onChange={e => setUpscale(parseInt(e.target.value) / 100)}
        />
      </div>

      <div>
        {data?.categories.map(cat => (
          <section className='bg-slate-200 p-4 mb-4 last:mb-0 rounded-md' key={cat.id}>
            <header className='mb-2'>
              {cat.name}[{cat.id}] (
              {cat.probability === 1 ? 'always presents' : 'probability ' + cat.probability * 100 + '%'})
            </header>
            <div className='flex gap-2 flex-wrap cursor-pointer'>
              {cat.layers.map(_layer => {
                const layer = new Layer(_layer.id, _layer.category);
                const singleLayerIid = new IidBuilder().fromIid(selected).withSingleLayer(layer).build();

                return (
                  <Image
                    onClick={() =>
                      onSelect(curr => {
                        const builder = new IidBuilder().fromIid(curr!);
                        return (curr!.contains(layer) ? builder.removeLayer(layer) : builder.setLayer(layer)).build();
                      })
                    }
                    iid={singleLayerIid}
                    active={selected.contains(layer)}
                    size={size}
                    key={singleLayerIid.id}
                    className={classNames('inline-block bg-slate-100 rounded')}
                  />
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
};
