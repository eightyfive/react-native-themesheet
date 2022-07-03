import React from 'react';
import _mapValues from 'lodash.mapvalues';
import { BoxBaseProps, BoxProps, Sizes } from './types';
import { getBoxStyle } from './utils';
import { ComponentType } from 'react';

export function createCreateBox<S extends Sizes>(sizes: S) {
  return function createBox<P extends BoxBaseProps>(
    BaseComponent: ComponentType<any>,
  ) {
    return ({
      style: styleProp,
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
    }: P & BoxProps<typeof sizes>) => {
      const style = getBoxStyle<typeof sizes>(
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

      return <BaseComponent {...rest} style={[style, styleProp]} />;
    };
  };
}
