'use client';

import React, { type ReactNode } from 'react';
import dynamic from 'next/dynamic';
import type { Settings } from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

// react-slick has type incompatibility with dynamic() and React 19
const SliderLib = dynamic(
  () => import('react-slick').then((mod) => mod.default as unknown as React.ComponentType<Settings & { children?: React.ReactNode }>),
  { ssr: false }
);

export type SliderProps = {
  children: ReactNode;
  settings?: Settings;
  className?: string;
};

const defaultSettings: Settings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 2,
  slidesToScroll: 1,
  arrows: true,
  responsive: [
    { breakpoint: 768, settings: { slidesToShow: 1, slidesToScroll: 1 } },
  ],
};

export default function Slider({ children, settings, className }: SliderProps) {
  return (
    <div className={className}>
      <SliderLib {...defaultSettings} {...settings}>
        {children}
      </SliderLib>
    </div>
  );
}
