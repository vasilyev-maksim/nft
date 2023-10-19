import * as React from 'react';
import { generate } from './api';
import { Image } from './Image';
import { Input } from './Input';
import * as shared from 'shared';

const DEFAULT_SIZE = 1500;

export const Preview: React.FC<{ iid?: shared.Iid }> = ({ iid }) => {
  const [filename, setFilename] = React.useState('');
  const [size, setSize] = React.useState<string>(localStorage.getItem('size') || '');

  React.useEffect(() => localStorage.setItem('size', size), [size]);
  React.useEffect(() => setFilename(''), [iid]);

  const handleSave = React.useCallback(() => {
    const sizeNum = parseInt(size) || DEFAULT_SIZE;
    const iidWithSize = new shared.IidBuilder().fromIid(iid!).withSize(sizeNum, sizeNum).build();

    generate(iidWithSize, filename);
  }, [iid, size, filename]);

  return (
    <div className='w-[400px]'>
      {iid && (
        <>
          <Image className='mt-7 rounded-md overflow-hidden' size={400} key={iid.id} iid={iid} />
          <form className='flex flex-col gap-1 mt-2'>
            <div className='flex flex-row gap-2 items-center'>
              <Input
                className='cursor-not-allowed'
                disabled
                placeholder={iid.id}
                value={filename}
                onChange={setFilename}
              />
              <span className='text-xs text-gray-500 shrink-0 w-[35px]'>.svg .png</span>
              <br />
            </div>
            <div className='flex flex-row gap-2 items-center'>
              <Input
                className='cursor-not-allowed'
                disabled
                placeholder={DEFAULT_SIZE.toString()}
                value={size}
                onChange={setSize}
              />
              <span className='text-xs text-gray-500 shrink-0 w-[35px]'>px</span>
              <br />
            </div>
            <div className='flex justify-center mt-4'>
              <button
                disabled
                onClick={handleSave}
                type='button'
                // className='w-full px-6 py-4 text-sm text-red-500 font-semibold rounded-xl border-2 border-red-400 hover:text-white hover:bg-red-400 hover:border-transparent focus:border-transparent focus:bg-red-500 focus:text-white'>
                className='cursor-not-allowed w-full px-6 py-4 text-sm text-gray-600 font-semibold rounded-md bg-gray-300'>
                Save as PNG
              </button>
            </div>
          </form>
        </>
      )}
    </div>
  );
};
