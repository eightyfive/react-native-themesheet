import {
  ColorValue,
  ImageStyle as RNImageStyle,
  StyleSheet,
  TextStyle as RNTextStyle,
  ViewStyle as RNViewStyle,
} from 'react-native';
import { createDialStyle, Dial } from 'react-native-col';
import _mapValues from 'lodash.mapvalues';
import { Colors, Sizes, SpacingProp } from './types';
import { aliasToProp } from './utils';

type Theme = {
  colors: Record<string, ColorValue>;
  sizes: Record<string, number>;
};

type SpacingStyle<S extends Sizes> = Partial<Record<SpacingProp, keyof S>>;

type FlexStyle = {
  col?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
  row?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
};

interface ViewStyle<S extends Sizes, C extends Colors>
  extends FlexStyle,
    SpacingStyle<S>,
    Omit<RNViewStyle, 'backgroundColor' | 'borderColor' | 'borderRadius'> {
  backgroundColor?: keyof C;
  borderColor?: keyof C;
  borderRadius?: keyof S;
}

interface TextStyle<S extends Sizes, C extends Colors>
  extends FlexStyle,
    SpacingStyle<S>,
    Omit<RNTextStyle, 'backgroundColor' | 'borderColor' | 'color'> {
  backgroundColor?: keyof C;
  borderColor?: keyof C;
  color?: keyof C;
}

interface ImageStyle<S extends Sizes, C extends Colors>
  extends FlexStyle,
    SpacingStyle<S>,
    Omit<RNImageStyle, 'backgroundColor' | 'borderColor'> {
  backgroundColor?: keyof C;
  borderColor?: keyof C;
}

type RNStyle = RNViewStyle | RNTextStyle | RNImageStyle;

type Style<S extends Sizes, C extends Colors> =
  | ViewStyle<S, C>
  | TextStyle<S, C>
  | ImageStyle<S, C>;

type NamedStyles<S extends Sizes, C extends Colors, T> = {
  [P in keyof T]: Style<S, C>;
};

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
            const styleName = aliasToProp[alias as SpacingProp];

            if (typeof value === 'number') {
              style[styleName] = value;
            } else {
              const size = sizes[value as keyof typeof sizes];

              if (size) {
                style[styleName] = size;
              } else {
                style[styleName] = value as string | number;

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
            // By default just forward prop

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
