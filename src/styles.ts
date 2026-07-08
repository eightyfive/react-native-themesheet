import { StyleSheet } from 'react-native';
import {
  AnyNamedStyles,
  Colors,
  OutputNamedStyles,
  RNStyle,
  Sizes,
  ThemeColorProp,
  ThemeSizeProp,
} from './types';

const colorProps: Record<ThemeColorProp, true> = {
  backgroundColor: true,
  borderColor: true,
  color: true,
  tintColor: true,
};

const sizeProps: Record<ThemeSizeProp, true> = {
  borderRadius: true,
  margin: true,
  marginTop: true,
  marginRight: true,
  marginBottom: true,
  marginLeft: true,
  marginHorizontal: true,
  marginVertical: true,
  marginStart: true,
  marginEnd: true,
  padding: true,
  paddingTop: true,
  paddingRight: true,
  paddingBottom: true,
  paddingLeft: true,
  paddingHorizontal: true,
  paddingVertical: true,
  paddingStart: true,
  paddingEnd: true,
  gap: true,
  columnGap: true,
  rowGap: true,
};

function hasProp<T extends object>(
  object: T,
  key: PropertyKey,
): key is keyof T {
  return Object.prototype.hasOwnProperty.call(object, key);
}

export function createStylesFactory<S extends Sizes, C extends Colors>(
  sizes: S,
  colors: C,
) {
  return function createStyles<T extends Record<string, object>>(
    styles: AnyNamedStyles<S, C, T>,
  ): OutputNamedStyles<T> {
    const mapped: { [P in keyof T]: RNStyle } = {} as {
      [P in keyof T]: RNStyle;
    };

    for (const key in styles) {
      const styleKey = key as keyof T;
      const aliases = styles[styleKey] as Record<string, unknown>;
      const style: Record<string, unknown> = {};

      for (const alias in aliases) {
        const value = aliases[alias];

        if (hasProp(colorProps, alias)) {
          const color = colors[value as keyof typeof colors];

          if (color !== undefined) {
            style[alias] = color;
          } else if (__DEV__) {
            console.warn(`Color not found: ${alias} (${String(value)})`);
          }
        } else if (hasProp(sizeProps, alias)) {
          const size = sizes[value as keyof typeof sizes];

          if (size !== undefined) {
            style[alias] = size;
          } else if (__DEV__) {
            console.warn(`Size not found: ${alias} (${String(value)})`);
          }
        } else {
          style[alias] = value;
        }
      }
      mapped[styleKey] = style as RNStyle;
    }

    return StyleSheet.create(mapped) as OutputNamedStyles<T>;
  };
}
