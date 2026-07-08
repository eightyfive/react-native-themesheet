import {
  AnyNamedStyles,
  Colors,
  NamedStyle,
  RNStyle,
  Sizes,
} from './types';

export function createVariantsFactory<S extends Sizes, C extends Colors>(
  createStyles: <T extends Record<string, object>>(
    styles: AnyNamedStyles<S, C, T>,
  ) => { [P in keyof T]: RNStyle },
) {
  return function createVariants<
    D extends object,
    V extends Record<string, object>,
    M extends Record<string, object>,
  >(
    defaults: NamedStyle<S, C, D>,
    variants: AnyNamedStyles<S, C, V>,
    modifiers: AnyNamedStyles<S, C, M>,
  ) {
    const dStyles = createStyles({ defaults } as AnyNamedStyles<
      S,
      C,
      { defaults: D }
    >);
    const vStyles = createStyles(variants as AnyNamedStyles<S, C, V>);
    const mStyles = createStyles(modifiers as AnyNamedStyles<S, C, M>);

    return function getVariantStyle(
      variant: keyof typeof vStyles,
      modifier: Partial<Record<keyof typeof mStyles, boolean>>,
    ) {
      const styles: RNStyle[] = [
        dStyles.defaults as RNStyle,
        vStyles[variant] as RNStyle,
      ];

      for (let mod in modifier) {
        if (modifier[mod]) {
          styles.push(mStyles[mod] as RNStyle);
        }
      }

      return styles;
    };
  };
}
