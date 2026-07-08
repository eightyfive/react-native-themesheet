import React from 'react';
import { Text } from 'react-native';
import { createTheme } from './index';

type ExpectTrue<T extends true> = T;
type ExpectFalse<T extends false> = T;

const { colors, createStyles, createVariants, sizes } = createTheme(
  {
    primary: 'black',
    accent: 'white',
    positive: 'green',
    negative: 'red',
    transparent: 'transparent',
    //
    onPrimary: 'white',
    onAccent: 'black',
  },
  {
    s: 4,
    m: 8,
    l: 16,
    roundness: 10,
  },
);

test('createStyles', () => {
  const $ = createStyles({
    box: {
      backgroundColor: 'primary',
      borderColor: 'accent',
      paddingHorizontal: 's',
      marginVertical: 'm',
      marginLeft: 'l',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
    },
    row: {
      marginTop: 'l',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'flex-end',
      borderRadius: 'roundness',
    },
    text: {
      backgroundColor: 'accent',
      color: 'onAccent',
      marginBottom: 'l',
    },
    error: {
      backgroundColor: 'negative',
      color: 'positive',
    },
    colLRB: {
      flexDirection: 'column',
      justifyContent: 'flex-end',
      alignItems: 'stretch',
    },
    image: {
      tintColor: 'accent',
    },
  });

  expect($.box).toEqual({
    backgroundColor: colors.primary,
    borderColor: colors.accent,
    paddingHorizontal: sizes.s,
    marginVertical: sizes.m,
    marginLeft: sizes.l,
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

  expect($.colLRB).toEqual({
    flexDirection: 'column',
    justifyContent: 'flex-end',
    alignItems: 'stretch',
  });

  type BoxHasNoTintColor = ExpectFalse<
    'tintColor' extends keyof typeof $.box ? true : false
  >;
  type BoxHasNoFontSize = ExpectFalse<
    'fontSize' extends keyof typeof $.box ? true : false
  >;
  type TextHasNoTintColor = ExpectFalse<
    'tintColor' extends keyof typeof $.text ? true : false
  >;
  type TextHasFontSize = ExpectTrue<
    'fontSize' extends keyof typeof $.text ? true : false
  >;
  type ImageHasTintColor = ExpectTrue<
    'tintColor' extends keyof typeof $.image ? true : false
  >;
  type ImageHasResizeMode = ExpectTrue<
    'resizeMode' extends keyof typeof $.image ? true : false
  >;
  const addressStyle = createStyles({
    address: {
      flex: 1,
    },
  }).address;
  type AddressHasNoBackfaceVisibility = ExpectFalse<
    'backfaceVisibility' extends keyof typeof addressStyle ? true : false
  >;

  const _boxHasNoTintColor: BoxHasNoTintColor = false;
  const _boxHasNoFontSize: BoxHasNoFontSize = false;
  const _textHasNoTintColor: TextHasNoTintColor = false;
  const _textHasFontSize: TextHasFontSize = true;
  const _imageHasTintColor: ImageHasTintColor = true;
  const _imageHasResizeMode: ImageHasResizeMode = true;
  const _addressHasNoBackfaceVisibility: AddressHasNoBackfaceVisibility = false;
  const _addressTextElement = React.createElement(Text, {
    style: addressStyle,
  });

  expect(_boxHasNoTintColor).toBe(false);
  expect(_boxHasNoFontSize).toBe(false);
  expect(_textHasNoTintColor).toBe(false);
  expect(_textHasFontSize).toBe(true);
  expect(_imageHasTintColor).toBe(true);
  expect(_imageHasResizeMode).toBe(true);
  expect(_addressHasNoBackfaceVisibility).toBe(false);
  expect(_addressTextElement).toBeTruthy();
  expect(addressStyle).toEqual({ flex: 1 });
});

test('createVariants', () => {
  const $ = createVariants(
    {
      borderWidth: 1,
      padding: 'm',
    },
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
        padding: 's',
      },
    },
  );

  expect($('primary', { compact: true, disabled: true })).toEqual([
    {
      borderWidth: 1,
      padding: sizes.m,
    },
    {
      backgroundColor: colors.onPrimary,
      borderColor: colors.onPrimary,
    },
    { padding: sizes.s },
    { opacity: 0.75 },
  ]);

  expect($('accent', { compact: false })).toEqual([
    {
      borderWidth: 1,
      padding: sizes.m,
    },
    {
      backgroundColor: colors.accent,
      borderColor: colors.accent,
    },
  ]);
});

if (false) {
  createStyles({
    invalidUnknownProp: {
      // @ts-expect-error Unknown style props are not supported in createStyles.
      paaa: 'm',
    },
  });

  createStyles({
    invalid: {
      // @ts-expect-error Shorthand props are not supported in createStyles.
      p: 'm',
    },
  });

  createStyles({
    invalidBorderRadius: {
      // @ts-expect-error borderRadius only accepts a size name.
      borderRadius: 10,
    },
  });

  createStyles({
    invalidColor: {
      // @ts-expect-error color only accepts a theme color name.
      color: '#fff',
    },
  });
}
