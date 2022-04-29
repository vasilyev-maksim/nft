import * as React from 'react';

type Item<Value, Body = React.ReactNode> = {
  value: Value;
  body: Body;
  key: string | number;
};

export interface SelectorProps<Value, Body = React.ReactNode> {
  items: Item<Value, Body>[];
  value: Value | null | undefined;
  onSelect: (value: Value, onlyOneRendered?: boolean) => void;
}
interface Props<Value, Body = React.ReactNode> extends SelectorProps<Value, Body> {
  layoutRender?: (children: React.ReactNode) => React.ReactElement;
  itemRender: (
    item: Item<Value, Body>,
    selected: boolean,
    handleSelect: () => void,
    onlyOneRendered: boolean,
  ) => React.ReactElement;
  renderSelectedOnly?: boolean;
}

export const SelectorBase: <Value, Body = React.ReactNode>(props: Props<Value, Body>) => React.ReactElement = ({
  items,
  itemRender,
  layoutRender = children => <>{children}</>,
  value,
  onSelect,
  renderSelectedOnly = false,
}) => {
  return layoutRender(
    items.map(x => (
      <Item
        renderSelectedOnly={renderSelectedOnly}
        key={x.key}
        itemRender={itemRender}
        item={x}
        selected={x.value === value}
        onSelect={onSelect}
      />
    )),
  );
};

const Item: <Value, Body = React.ReactNode>(props: {
  item: Item<Value, Body>;
  itemRender: Props<Value, Body>['itemRender'];
  onSelect: (value: Value, onlyOneRendered: boolean) => void;
  renderSelectedOnly: boolean;
  selected: boolean;
}) => React.ReactElement | null = ({ item, itemRender, onSelect, selected, renderSelectedOnly }) => {
  const handleClick = React.useCallback(
    () => onSelect(item.value, renderSelectedOnly),
    [onSelect, item.value, renderSelectedOnly],
  );
  return selected || !renderSelectedOnly ? itemRender(item, selected, handleClick, renderSelectedOnly) : null;
};
