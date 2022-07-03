import { createTheme } from './theme';

const { colors, createStyles, createVariants, sizes } = createTheme({
  colors: {
    primary: 'black',
    accent: 'white',
    positive: 'green',
    negative: 'red',
    transparent: 'transparent',
    //
    onPrimary: 'white',
    onAccent: 'black',
  },
  sizes: {
    s: 4,
    m: 8,
    l: 16,
    roundness: 10,
  },
});

// Theme

test('createStyles', () => {
  const $ = createStyles({
    box: {
      backgroundColor: 'primary',
      borderColor: 'accent',
      px: 's',
      my: 'm',
      marginLeft: 30,
      col: 5,
    },
    row: {
      mt: 'l',
      row: 8,
      borderRadius: 'roundness',
    },
    text: {
      backgroundColor: 'accent',
      color: 'onAccent',
      mb: 'l',
    },
    error: {
      backgroundColor: 'negative',
      color: 'positive',
    },
  });

  expect($.box).toEqual({
    backgroundColor: colors.primary,
    borderColor: colors.accent,
    paddingHorizontal: sizes.s,
    marginVertical: sizes.m,
    marginLeft: 30,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  });

  expect($.row).toEqual({
    marginTop: sizes.l,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    borderRadius: sizes.roundness,
  });

  expect($.text).toEqual({
    backgroundColor: colors.accent,
    color: colors.onAccent,
    marginBottom: sizes.l,
  });

  expect($.error).toEqual({
    backgroundColor: colors.negative,
    color: colors.positive,
  });
});

test('createVariants', () => {
  const $ = createVariants(
    {
      primary: {
        backgroundColor: 'onPrimary',
        borderColor: 'onPrimary',
      },
      accent: {
        backgroundColor: 'accent',
        borderColor: 'accent',
      },
      secondary: {
        backgroundColor: 'transparent',
        borderColor: 'onPrimary',
      },
    },
    {
      disabled: {
        opacity: 0.75,
      },
      compact: {
        px: 's',
      },
    },
  );

  expect($('primary', { disabled: true })).toEqual([
    {
      backgroundColor: colors.onPrimary,
      borderColor: colors.onPrimary,
    },
    { opacity: 0.75 },
  ]);
});
