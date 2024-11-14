import { StyleSheet, ViewStyle as RNViewStyle } from 'react-native';
import { SpacingProp, SpacingName, BoxProps, Sizes } from './types';

export function getKeys<T extends object>(object: T) {
  return Object.keys(object) as (keyof T)[];
}

export const aliasToProp: Record<SpacingProp, SpacingName> = {
  m: 'margin',
  mt: 'marginTop',
  mr: 'marginRight',
  mb: 'marginBottom',
  ml: 'marginLeft',
  mx: 'marginHorizontal',
  my: 'marginVertical',
  ms: 'marginStart',
  me: 'marginEnd',
  //
  p: 'padding',
  pt: 'paddingTop',
  pr: 'paddingRight',
  pb: 'paddingBottom',
  pl: 'paddingLeft',
  px: 'paddingHorizontal',
  py: 'paddingVertical',
  ps: 'paddingStart',
  pe: 'paddingEnd',
};

const sheets = new Map<string, RNViewStyle>();

export function getBoxStyle<S extends Sizes>(props: BoxProps<S>, sizes: S) {
  const cacheKey = JSON.stringify(props);

  if (!sheets.has(cacheKey)) {
    const style: RNViewStyle = {};
    const aliasNames = getKeys(props);

    aliasNames.forEach((alias) => {
      const sizeName = props[alias];

      if (sizeName) {
        style[aliasToProp[alias]] = sizes[sizeName];
      }
    });

    const { sheet } = StyleSheet.create({ sheet: style });

    sheets.set(cacheKey, sheet);
  }

  return sheets.get(cacheKey);
}
