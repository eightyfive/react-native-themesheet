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
import { propToName } from './utils';

type ThemeT = {
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

export function createTheme<TT extends ThemeT>({ colors, sizes }: TT) {
  //
  // createStyles
  //
  function createStyles<
    T extends
      | NamedStyles<TT['sizes'], TT['colors'], T>
      | NamedStyles<TT['sizes'], TT['colors'], any>,
  >(
    styles: T | NamedStyles<TT['sizes'], TT['colors'], T>,
  ): StyleSheet.NamedStyles<T> {
    return StyleSheet.create(
      _mapValues(styles, (style) => {
        const result: RNStyle = {};

        for (let key in style) {
          const value = style[key];

          if (
            key === 'backgroundColor' ||
            key === 'borderColor' ||
            key === 'color'
          ) {
            const color = colors[value as keyof typeof colors];

            if (color) {
              // @ts-ignore
              result[key] = color;
            } else {
              // @ts-ignore
              result[key] = value as ColorValue;

              if (__DEV__) {
                console.warn(`Color not found: ${key} (${color})`);
              }
            }
          } else if (key === 'borderRadius') {
            const size = sizes[value as keyof typeof sizes];

            if (size) {
              result.borderRadius = size;
            } else {
              result.borderRadius = value as number;

              if (__DEV__) {
                console.warn(`Size not found: ${key} (${value})`);
              }
            }
          } else if (key in propToName) {
            const rnSpacingProperty = propToName[key as SpacingProp];

            if (typeof value === 'number') {
              result[rnSpacingProperty] = value;
            } else {
              const size = sizes[value as keyof typeof sizes];

              if (size) {
                result[rnSpacingProperty] = size;
              } else {
                result[rnSpacingProperty] = value as string | number;

                if (__DEV__) {
                  console.warn(`Size not found: ${key} (${value})`);
                }
              }
            }
          } else if (key === 'col' || key === 'row') {
            if (typeof value === 'number' && (value >= 1 || value <= 9)) {
              Object.assign(
                result,
                createDialStyle(
                  key === 'col' ? 'column' : 'row',
                  value as Dial,
                ),
              );
            } else if (__DEV__) {
              console.warn(`Flex value invalid: ${key} (${value})`);
            }
          } else {
            // @ts-ignore
            result[key] = value;
          }
        }

        return result;
      }),
    );
  }

  //
  // createVariants
  //
  function createVariants<
    V extends
      | NamedStyles<TT['sizes'], TT['colors'], V>
      | NamedStyles<TT['sizes'], TT['colors'], any>,
    M extends
      | NamedStyles<TT['sizes'], TT['colors'], M>
      | NamedStyles<TT['sizes'], TT['colors'], any>,
  >(
    variants: V | NamedStyles<TT['sizes'], TT['colors'], V>,
    modifiers: M | NamedStyles<TT['sizes'], TT['colors'], M>,
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
