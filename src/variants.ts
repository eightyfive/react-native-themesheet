import {
  AnyNamedStyles,
  Colors,
  OutputNamedStyles,
  Sizes,
  Style,
} from './types';

export function createVariantsFactory<S extends Sizes, C extends Colors>(
  createStyles: <T extends AnyNamedStyles<S, C>>(
    styles: T,
  ) => OutputNamedStyles<S, C, T>,
) {
  return function createVariants<
    V extends AnyNamedStyles<S, C>,
    M extends AnyNamedStyles<S, C>,
  >(defaults: Style<S, C>, variants: V, modifiers: M) {
    const dStyles = createStyles({ defaults });
    const vStyles = createStyles(variants);
    const mStyles = createStyles(modifiers);

    return function getVariantStyle(
      variant: keyof typeof vStyles,
      modifier: Partial<Record<keyof typeof mStyles, boolean>>,
    ) {
      const styles = [dStyles.defaults, vStyles[variant]];

      for (let mod in modifier) {
        if (modifier[mod]) {
          styles.push(mStyles[mod]);
        }
      }

      return styles;
    };
  };
}
