import { ColorValue, StyleSheet } from 'react-native';
import { createDialStyle, Dial } from 'react-native-col';
import _mapValues from 'lodash.mapvalues';
import { Colors, NamedStyles, RNStyle, Sizes, SpacingProp } from './types';
import { aliasToProp } from './utils';

export function createStylesFactory<S extends Sizes, C extends Colors>(
  sizes: S,
  colors: C,
) {
  return function createStyles<
    T extends NamedStyles<S, C, T> | NamedStyles<S, C, any>,
  >(styles: T | NamedStyles<S, C, T>): StyleSheet.NamedStyles<T> {
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
                console.warn(`Color not found: ${alias} (${String(color)})`);
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
  };
}
