import React, { ComponentType } from 'react';
import _mapValues from 'lodash.mapvalues';
import { BoxProps, Sizes } from './types';
import { getBoxStyle } from './utils';

export function createBoxFactory<S extends Sizes>(sizes: S) {
  return function createBox<Props>(Component: ComponentType<any>) {
    return ({
      m,
      mt,
      mr,
      mb,
      ml,
      mx,
      my,
      ms,
      me,
      //
      p,
      pt,
      pr,
      pb,
      pl,
      px,
      py,
      ps,
      pe,
      ...rest
    }: Props & BoxProps<S>) => {
      const style = getBoxStyle<S>(
        {
          m,
          mt,
          mr,
          mb,
          ml,
          mx,
          my,
          ms,
          me,
          //
          p,
          pt,
          pr,
          pb,
          pl,
          px,
          py,
          ps,
          pe,
        },
        sizes,
      );

      return <Component {...rest} style={[style, (rest as any).style]} />;
    };
  };
}
