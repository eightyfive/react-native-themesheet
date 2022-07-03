import React, { ComponentType } from 'react';
import { StyleProp, StyleSheet, ViewStyle } from 'react-native';
import { getKeys, propToStyle } from './utils';
import { Sizes } from './types';

type SpacingProps<S extends Sizes> = {
  [Key in keyof typeof propToStyle]?: keyof S;
};

type Props = {
  style?: StyleProp<ViewStyle>;
};

export function createBox<S extends Sizes, P extends Props>(
  sizes: S,
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
  }: P & SpacingProps<S>) => {
    const style = getSpacingStyle<S>(
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
}

const cache = new Map();

function getSpacingStyle<S extends Sizes>(
  spacingProps: SpacingProps<S>,
  sizes: S,
) {
  const cacheKey = JSON.stringify(spacingProps);

  if (!cache.has(cacheKey)) {
    const style: ViewStyle = {};
    const spacingPropNames = getKeys(spacingProps);

    spacingPropNames.forEach((propName) => {
      const sizeName = spacingProps[propName];

      if (sizeName) {
        style[propToStyle[propName]] = sizes[sizeName];
      }
    });

    const { container } = StyleSheet.create({ container: style });

    cache.set(cacheKey, container);
  }

  return cache.get(cacheKey);
}
