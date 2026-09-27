import { ColorValue, PlatformColor, TextStyle, ViewStyle } from 'react-native';
import { createTheme } from './index';
import { OutputNamedStyles, Style, ThemeColorProp } from './types';

const { createStyles, createVariants } = createTheme(
  { outlineVariant: '#1C2E3D', red: '#123456' },
  {},
);

const colorProperties = [
  'backgroundColor',
  'borderColor',
  'color',
  'tintColor',
  'borderTopColor',
  'borderRightColor',
  'borderBottomColor',
  'borderLeftColor',
  'borderStartColor',
  'borderEndColor',
  'borderBlockColor',
  'borderBlockStartColor',
  'borderBlockEndColor',
  'shadowColor',
  'textShadowColor',
  'textDecorationColor',
  'overlayColor',
  'outlineColor',
] as const;

test.each(colorProperties)('%s resolves theme colors', (property) => {
  const styles = createStyles({
    row: { [property]: 'outlineVariant' } as Partial<
      Record<typeof colorProperties[number], 'outlineVariant'>
    >,
  });
  expect(styles.row).toEqual({ [property]: '#1C2E3D' });
});

test.each(colorProperties)(
  '%s rejects unchecked literal colors',
  (property) => {
    const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
    try {
      for (const color of [
        '#abc',
        'rgb(1, 2, 3)',
        'hsl(120, 50%, 50%)',
        'blue',
        'transparent',
        PlatformColor('labelColor'),
      ]) {
        // Simulate unchecked input from JavaScript.
        const row = { [property]: color } as Partial<
          Record<typeof colorProperties[number], 'outlineVariant'>
        >;
        expect(createStyles({ row }).row).toEqual({});
        expect(warn).toHaveBeenLastCalledWith(
          `Color not found: ${property} (${String(color)})`,
        );
      }
    } finally {
      warn.mockRestore();
    }
  },
);

test('color names resolve only through the theme', () => {
  expect(createStyles({ row: { borderBottomColor: 'red' } }).row).toEqual({
    borderBottomColor: '#123456',
  });
});

test('variants resolve directional borders in defaults, variants and modifiers', () => {
  const variant = createVariants(
    { borderTopColor: 'outlineVariant' },
    { active: { borderBottomColor: 'outlineVariant' } },
    { selected: { borderStartColor: 'outlineVariant' } },
  );
  expect(variant('active', { selected: true })).toEqual([
    { borderTopColor: '#1C2E3D' },
    { borderBottomColor: '#1C2E3D' },
    { borderStartColor: '#1C2E3D' },
  ]);
});

test.each(colorProperties)('%s warns and omits unknown colors', (property) => {
  const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
  try {
    // Simulate unchecked input from JavaScript.
    const row = { [property]: 'outlineTypo' } as Partial<
      Record<typeof colorProperties[number], 'outlineVariant'>
    >;
    expect(createStyles({ row }).row).toEqual({});
    expect(warn).toHaveBeenCalledWith(
      `Color not found: ${property} (outlineTypo)`,
    );
  } finally {
    warn.mockRestore();
  }
});

if (false) {
  type Assert<T extends true> = T;
  type Colors = { outlineVariant: string };
  type RejectsInvalidTokens = Assert<
    {
      [P in ThemeColorProp]: { [K in P]: 'outlineTypo' } extends Style<
        {},
        Colors
      >
        ? false
        : true;
    }[ThemeColorProp]
  >;
  type OnlyThemeKeys = Assert<
    {
      [P in ThemeColorProp]: NonNullable<
        Style<{}, Colors>[P]
      > extends keyof Colors
        ? true
        : false;
    }[ThemeColorProp]
  >;

  createStyles({
    row: {
      // @ts-expect-error Hex literals must be declared in the theme.
      borderBottomColor: '#abc',
    },
  });
  createStyles({
    text: {
      // @ts-expect-error Named literal colors must be declared in the theme.
      textShadowColor: 'blue',
    },
  });
  createStyles({
    image: {
      // @ts-expect-error Platform colors must be declared in the theme.
      overlayColor: PlatformColor('labelColor'),
    },
  });
  type ResolvedColors = OutputNamedStyles<{
    row: Record<ThemeColorProp, 'outlineVariant'>;
  }>['row'];
  type OutputsNativeColors = Assert<
    ResolvedColors extends Record<ThemeColorProp, ColorValue> ? true : false
  >;
  type ResolvesEveryColor = Assert<
    Exclude<
      Extract<
        | keyof ViewStyle
        | keyof TextStyle
        | keyof import('react-native').ImageStyle,
        'color' | `${string}Color`
      >,
      ThemeColorProp
    > extends never
      ? true
      : false
  >;

  // Use explicit properties: computed keys can widen and bypass input validation.
  createStyles({
    row: {
      // @ts-expect-error Unknown theme color names must be rejected.
      borderBottomColor: 'outlineTypo',
    },
  });
  createStyles({
    row: {
      // @ts-expect-error Text-specific properties must not bypass color validation.
      borderTopColor: 'outlineTypo',
      fontSize: 12,
    },
  });
  createStyles({
    row: {
      // @ts-expect-error Image-specific properties must not bypass color validation.
      borderEndColor: 'outlineTypo',
      resizeMode: 'cover',
    },
  });
  createStyles({
    row: {
      // @ts-expect-error Logical border colors must validate tokens too.
      borderBlockStartColor: 'outlineTypo',
    },
  });

  const styles = createStyles({ row: { borderBottomColor: 'outlineVariant' } });
  const view: ViewStyle = styles.row;
  const text: TextStyle = styles.row;
  const color: ColorValue = styles.row.borderBottomColor;
  // @ts-expect-error Resolved colors are not restricted to the input theme key.
  const token: 'outlineVariant' = styles.row.borderBottomColor;
}
