import { ColorValue, StyleSheet } from 'react-native';
import { createDialStyle, Dial } from 'react-native-col';
import _mapValues from 'lodash.mapvalues';
import { NamedStyles, RNStyle, SpacingProp, Theme } from './types';
import { aliasToProp } from './utils';

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
  // API
  //
  return {
    colors,
    sizes,
    //
    createStyles,
    createVariants,
  };
}
