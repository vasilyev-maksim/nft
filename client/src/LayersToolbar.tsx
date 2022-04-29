import classNames from 'classnames';
import * as React from 'react';
import { useQuery } from 'react-query';
import { getCollectionConfig } from './api';
import { useCollection } from './hooks';
import { Image } from './Image';
import { Iid } from './Iid';
import { IidBuilder } from './IidBuilder';

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
        {data?.groups.map(g => (
          <section className='bg-slate-200 p-4 mb-4 last:mb-0 rounded-xl' key={g.id}>
            <header className='mb-2'>
              {g.id} ({g.probability === 1 ? 'always presents' : 'probability ' + g.probability * 100 + '%'})
            </header>
            <div className='flex gap-2 flex-wrap cursor-pointer'>
              {g.layers.map(layerId => (
                <Image
                  onClick={() =>
                    onSelect(_x => {
                      //TODO: extract this logic to IID ?
                      const builder = new IidBuilder(_x);
                      const alter = g.layers.find(l => _x?.contains(l));

                      if (alter) {
                        if (alter !== layerId) {
                          builder.removeLayer(alter).addLayer(layerId);
                        } else {
                          builder.removeLayer(alter);
                        }
                      } else {
                        builder.addLayer(layerId);
                      }

                      return builder.build();
                    })
                  }
                  iid={selected.getBuilder().withSingleLayer(layerId).build()}
                  active={selected.contains(layerId)}
                  size={size}
                  key={layerId}
                  className={classNames('inline-block bg-slate-100 rounded')}
                />
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
};
