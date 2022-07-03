import { StyleSheet } from 'react-native';
import _mapValues from 'lodash.mapvalues';
import { Colors, NamedStyles, Sizes } from './types';

export function createCreateVariants<S extends Sizes, C extends Colors>(
  createStyles: <T>(
    styles: T | NamedStyles<S, C, T>,
  ) => StyleSheet.NamedStyles<T>,
) {
  return function createVariants<
    V extends NamedStyles<S, C, V> | NamedStyles<S, C, any>,
    M extends NamedStyles<S, C, M> | NamedStyles<S, C, any>,
  >(variants: V | NamedStyles<S, C, V>, modifiers: M | NamedStyles<S, C, M>) {
    const vStyles = createStyles(variants);
    const mStyles = createStyles(modifiers);

    return function getVariantStyle(
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
  };
}
