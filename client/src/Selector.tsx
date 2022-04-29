import classNames from 'classnames';
import * as React from 'react';
import { useToggleState } from './hooks';
import { Marquee } from './Marquee';
import { SelectorBase, SelectorProps } from './SelectorBase';

// eslint-disable-next-line @typescript-eslint/ban-types
export const Selector = <T extends Object>(props: SelectorProps<T, string>): React.ReactElement => {
  const { toggle, state: expanded } = useToggleState();
  const handleSelect = React.useCallback(
    (value, onlyOneRendered) => {
      if (!onlyOneRendered) {
        props.onSelect(value);
      }
      toggle();
    },
    [toggle, props.onSelect],
  );

  return (
    <SelectorBase<T, string>
      {...props}
      renderSelectedOnly={!expanded}
      onSelect={handleSelect}
      layoutRender={children => <>{children}</>}
      itemRender={(item, selected, handleClick, onlyOneRendered) => (
        <span
          className={classNames('text-gray-500 text-xs cursor-pointer hover:bg-gray-200 m-1', {
            'bg-gray-200': selected && !onlyOneRendered,
          })}
          onClick={handleClick}>
          [<Marquee length={20}>{item.body}</Marquee>]
        </span>
      )}
    />
  );
};
