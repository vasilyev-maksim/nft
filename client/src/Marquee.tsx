import * as React from 'react';

const gapSize = 1;
const timeout = 300;

export const Marquee: React.FC<{ children: string; length: number }> = ({ children, length }) => {
  const [l, setl] = React.useState(0);
  const animated = children.length > length;
  const canvas = children + ' '.repeat(gapSize);
  const visiblePart = React.useMemo(() => {
    if (animated) {
      const r = (l + length) % canvas.length;
      return l > r ? canvas.slice(l, canvas.length) + canvas.slice(0, r) : canvas.slice(l, r);
    } else {
      return children;
    }
  }, [children, gapSize, l, length, canvas, animated]);

  React.useEffect(() => {
    setl(0);

    if (animated) {
      const id = setInterval(() => {
        setl(i => (i + 1) % children.length);
      }, timeout);
      return () => clearInterval(id);
    }
  }, [children, length, animated]);

  return <>{visiblePart}</>;
};
