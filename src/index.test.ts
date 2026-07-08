import React from 'react';
import { Image, Text, View } from 'react-native';
import { createTheme } from './index';

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
    address: {
      flex: 1,
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

  const _boxViewElement = React.createElement(View, {
    style: $.box,
  });
  const _textElement = React.createElement(Text, {
    style: $.text,
  });
  const _imageElement = React.createElement(Image, {
    style: $.image,
  });
  const _addressTextElement = React.createElement(Text, {
    style: $.address,
  });

  expect(_boxViewElement).toBeTruthy();
  expect(_textElement).toBeTruthy();
  expect(_imageElement).toBeTruthy();
  expect(_addressTextElement).toBeTruthy();
  expect($.image).toEqual({ tintColor: colors.accent });
  expect($.address).toEqual({ flex: 1 });
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
