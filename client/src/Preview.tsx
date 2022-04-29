import * as React from 'react';
import { generate } from './api';
import { Image } from './Image';
import { Input } from './Input';
import { Iid } from './Iid';

const DEFAULT_SIZE = 1500;

export const Preview: React.FC<{ iid?: Iid }> = ({ iid }) => {
  const [filename, setFilename] = React.useState('');
  const [size, setSize] = React.useState<string>('');

  return (
    <div className='w-[400px]'>
      {iid && (
        <>
          <Image className='mt-7' size={400} iid={iid} />
          <form
            className='flex flex-col gap-1 mt-2'
            onSubmit={e => {
              e.preventDefault();
              generate(iid!, filename, parseInt(size)).then(() => {
                alert(`${filename} image saved!`);
                setFilename('');
              });
            }}>
            <div className='flex flex-row gap-2 items-center'>
              <Input placeholder={iid.id} value={filename} onChange={setFilename} />
              <span className='text-xs text-gray-500 shrink-0 w-[35px]'>.svg .png</span>
              <br />
            </div>
            <div className='flex flex-row gap-2 items-center'>
              <Input placeholder={DEFAULT_SIZE.toString()} value={size} onChange={setSize} />
              <span className='text-xs text-gray-500 shrink-0 w-[35px]'>px</span>
              <br />
            </div>
            <div className='text-center mt-4'>
              <button
                type='submit'
                className='px-6 py-4 text-sm text-blue-500 font-semibold rounded-xl border-2 border-blue-400 hover:text-white hover:bg-blue-500 hover:border-transparent focus:border-transparent focus:bg-blue-600 focus:text-white'>
                GENERATE
              </button>
            </div>
          </form>
        </>
      )}
    </div>
  );
};
