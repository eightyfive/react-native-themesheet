import React from 'react';
import { ColorValue, StyleSheet } from 'react-native';
import { createDialStyle, Dial } from 'react-native-col';
import _mapValues from 'lodash.mapvalues';
import {
  BoxBaseProps,
  BoxProps,
  NamedStyles,
  RNStyle,
  SpacingProp,
  Theme,
} from './types';
import { aliasToProp, getBoxStyle } from './utils';
import { ComponentType } from 'react';

export function createTheme<T extends Theme>({ colors, sizes }: T) {
  //
  // createStyles
  //
  function createStyles<
    S extends
      | NamedStyles<T['sizes'], T['colors'], S>
      | NamedStyles<T['sizes'], T['colors'], any>,
  >(
    styles: S | NamedStyles<T['sizes'], T['colors'], S>,
  ): StyleSheet.NamedStyles<S> {
    return StyleSheet.create(
      _mapValues(styles, (aliases) => {
        const style: RNStyle = {};

        for (let alias in aliases) {
          const value = aliases[alias];

          if (
            alias === 'backgroundColor' ||
            alias === 'borderColor' ||
            alias === 'color'
          ) {
            const color = colors[value as keyof typeof colors];

            if (color) {
              // @ts-ignore
              style[alias] = color;
            } else {
              // @ts-ignore
              style[alias] = value as ColorValue;

              if (__DEV__) {
                console.warn(`Color not found: ${alias} (${color})`);
              }
            }
          } else if (alias === 'borderRadius') {
            const size = sizes[value as keyof typeof sizes];

            if (size) {
              style.borderRadius = size;
            } else {
              style.borderRadius = value as number;

              if (__DEV__) {
                console.warn(`Size not found: ${alias} (${value})`);
              }
            }
          } else if (alias in aliasToProp) {
            const prop = aliasToProp[alias as SpacingProp];

            if (typeof value === 'number') {
              style[prop] = value;
            } else {
              const size = sizes[value as keyof typeof sizes];

              if (size) {
                style[prop] = size;
              } else {
                style[prop] = value as string | number;

                if (__DEV__) {
                  console.warn(`Size not found: ${alias} (${value})`);
                }
              }
            }
          } else if (alias === 'col' || alias === 'row') {
            if (typeof value === 'number' && (value >= 1 || value <= 9)) {
              Object.assign(
                style,
                createDialStyle(
                  alias === 'col' ? 'column' : 'row',
                  value as Dial,
                ),
              );
            } else if (__DEV__) {
              console.warn(`Flex value invalid: ${alias} (${value})`);
            }
          } else {
            // By default just forward prop (= alias)

            // @ts-ignore
            style[alias] = value;
          }
        }

        return style;
      }),
    );
  }

  //
  // createVariants
  //
  function createVariants<
    V extends
      | NamedStyles<T['sizes'], T['colors'], V>
      | NamedStyles<T['sizes'], T['colors'], any>,
    M extends
      | NamedStyles<T['sizes'], T['colors'], M>
      | NamedStyles<T['sizes'], T['colors'], any>,
  >(
    variants: V | NamedStyles<T['sizes'], T['colors'], V>,
    modifiers: M | NamedStyles<T['sizes'], T['colors'], M>,
  ) {
    const vStyles = createStyles(variants);
    const mStyles = createStyles(modifiers);

    return function (
      variant: keyof typeof vStyles,
      modifier: Partial<Record<keyof typeof mStyles, boolean>>,
    ) {
      const styles = [vStyles[variant]];

      for (let mod in modifier) {
        if (modifier[mod]) {
          styles.push(mStyles[mod]);
        }
      }

      return styles;
    };
  }

  //
  // createBox
  //
  function createBox<P extends BoxBaseProps>(
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
  }

  //
  // API
  //
  return {
    colors,
    sizes,
    //
    createBox,
    createStyles,
    createVariants,
  };
}
