import _mapValues from 'lodash.mapvalues';
import { createCreateStyles } from './styles';
import { createCreateVariants } from './variants';
import { Colors, Sizes } from './types';
import { createCreateBox } from './box';

export function createTheme<C extends Colors, S extends Sizes>(
  colors: C,
  sizes: S,
) {
  const createStyles = createCreateStyles(sizes, colors);

  const createVariants = createCreateVariants<typeof sizes, typeof colors>(
    createStyles,
  );

  const createBox = createCreateBox<typeof sizes>(sizes);

  return {
    colors,
    sizes,
    //
    createBox,
    createStyles,
    createVariants,
  };
}
