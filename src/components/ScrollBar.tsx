import { ReactNode } from 'react';
import classNames from 'classnames';

const ScrollBar = ({
  children,
  className,
  duplicate = 4,
}: {
  children: ReactNode;
  className?: string;
  duplicate?: number;
}) => {
  return (
    <div
      className={classNames(
        className,
        'relative w-full overflow-hidden bg-primary text-light'
      )}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-primary via-transparent to-primary pointer-events-none" />
      <div className="flex w-max animate-loop space-x-20">
        {Array.from({ length: duplicate }).map((_, i) => (
          <div key={i} className="flex space-x-20 shrink-0">
            {children}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ScrollBar;
