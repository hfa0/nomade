import React from 'react';
import Link from 'next/link';
import classNames from 'classnames';
import LogoSvg from '@/assets/logos/logo.svg';
import LogoCleanSvg from '@/assets/logos/logo_clean.svg';

export type LogoVariant = 'normal' | 'clean';

export type LogoProps = {
  variant?: LogoVariant;
  size?: number;
  className?: string;
  href?: string;
};

const Logo = ({
  variant = 'normal',
  size = 50,
  className,
  href,
}: LogoProps) => {
  const SvgComponent = variant === 'clean' ? LogoCleanSvg : LogoSvg;

  const svg = (
    <SvgComponent
      className={classNames(className)}
      width={size}
      height={size}
    />
  );

  if (!href) return svg;

  return (
    <Link href={href} className="shrink-0">
      {svg}
    </Link>
  );
};

export default Logo;
