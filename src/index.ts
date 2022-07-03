import _mapValues from 'lodash.mapvalues';
import { createStylesFactory } from './styles';
import { createVariantsFactory } from './variants';
import { Colors, Sizes } from './types';
import { createBoxFactory } from './box';

export function createTheme<C extends Colors, S extends Sizes>(
  colors: C,
  sizes: S,
) {
  const createStyles = createStylesFactory(sizes, colors);

  const createVariants = createVariantsFactory<typeof sizes, typeof colors>(
    createStyles,
  );

  const createBox = createBoxFactory<typeof sizes>(sizes);

  return {
    colors,
    sizes,
    //
    createBox,
    createStyles,
    createVariants,
  };
}
