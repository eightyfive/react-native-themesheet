import _mapValues from 'lodash.mapvalues';
import { Theme } from './types';
import { createCreateBox } from './box';
import { createCreateStyles } from './styles';
import { createCreateVariants } from './variants';

export function createTheme<T extends Theme>({ colors, sizes }: T) {
  const createStyles = createCreateStyles(sizes, colors);

  const createVariants = createCreateVariants<typeof sizes, typeof colors>(
    createStyles,
  );

  const createBox = createCreateBox<typeof sizes>(sizes);

  //
  // API
  //
  return {
    colors,
    sizes,
    //
    createBox,
    createStyles,
    createVariants,
  };
}
