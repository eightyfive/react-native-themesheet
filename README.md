# `react-native-themesheet`

Lightweight alternative to [@shopify/restyle](https://github.com/Shopify/restyle).

## Install

```bash
yarn add react-native-themesheet
```

## Usage

### Create theme

A Theme consist of a set of `colors` & a set of `sizes`.

```ts
// src/views/theme.ts

export const { createBox, createStyles, createVariants } = createTheme(
  {
    primary: 'black',
    accent: 'white',
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
```

### Create styles

`createStyles` allows you to create normal `react-native` styles with Theme color and size mapping.

```ts
// src/views/home.tsx

import { createStyles } from './theme';

const $ = createStyles({
  container: {
    backgroundColor: 'primary', // <-- color name
    borderColor: 'accent', // <-- color name
    borderRadius: 'roundness', // <-- size name
    paddingHorizontal: 's', // <-- size name
    marginVertical: 'm', // <-- size name
    marginLeft: 'l', // <-- size name
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: 'onPrimary', // <-- color name
    paddingLeft: 'l', // <-- size name
  },
});

export function Home(props) {
  return (
    <View style={$.container}>
      <Text style={$.text}>Hello !</Text>
    </View>
  );
}
```

### Create variants

`createVariants` allows you to easily compose a component "variant" style.

```ts
// src/views/lib/button.tsx

import { createVariants } from '../theme';

const $ = createVariants(
  // defaults
  {
    borderRadius: 'roundness',
    borderWidth: 1,
    padding: 'm',
  },
  // variants
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
  // modifiers
  {
    disabled: {
      opacity: 0.75,
    },
    compact: {
      padding: 's',
    },
  },
);

type Props = {
  children: string;
  compact?: boolean;
  disabled?: boolean;
  loading?: boolean;
  variant?: 'primary' | 'accent' | 'secondary';
};

export function Button({
  children,
  compact = false,
  disabled = false,
  loading = false,
  variant = 'primary',
}: Props) {
  //
  // ¡¡ `$` is function here !! (see API)
  const styles = $(variant, {
    disabled: disabled || loading,
    compact,
  });

  // styles = [
  //   <defaults style>,
  //   <primary style> | <accent style> | <secondary style>,
  //   (disabled || loading) && <disabled style>,
  //   compact && <compact style>
  // ]

  return (
    <Pressable style={styles}>
      <Text>{children}</Text>
    </Pressable>
  );
}
```

### Create boxes

`createBox` enhance a component with spacing shorthand properties.

```ts
// src/views/lib.ts

import { Text as RNText, TextProps, View, ViewProps } from 'react-native';

import { createBox } from './theme';

export const Col = createBox<ViewProps>(View);

export const Text = createBox<TextProps>(RNText);

export const Title = createBox<TextProps>((props: TextProps) => (
  <RNText {...props} style={{ fontSize: 22 }}></RNText>
));
```

Later in app:

```ts
// src/views/header.tsx

import { Col, Text, Title } from './lib';

type Props = {
  title: string;
  subtitle?: string;
};

export function Header({ title, subtitle }: Props) {
  return (
    <Col py="m">
      <Title px="m">{title}</Title>
      {subtitle ? (
        <Text px="l" mt="s">
          {subtitle}
        </Text>
      ) : null}
    </Col>
  );
}
```

## API

### `createTheme(colors, sizes)`

```ts
type Colors = Record<string, ColorValue>

type Sizes = Record<string, number>

createTheme<C extends Colors, S extends Sizes>(colors: C, sizes: S): {
  colors,
  sizes,
  //
  createBox,
  createStyles,
  createVariants
}
```

This is the only public API available. All utility functions are exported from it.

```ts
// src/views/theme.ts

import { createTheme } from 'react-native-themesheet';

export const { colors, createBox, createStyles, createVariants, sizes } =
  createTheme(
    {
      primary: '#000',
      accent: '#ffffff',
    },
    {
      s: 4,
      m: 8,
    },
  );
```

### `Theme.createBox(BaseComponent)`

```ts
createBox<BaseComponentProps>(BaseComponent: ComponentType<any>)
```

Enhance `BaseComponent` with spacing shorthand properties:

| Shorthand | Property            |
| --------- | ------------------- |
| `m`       | `margin`            |
| `mt`      | `marginTop`         |
| `mr`      | `marginRight`       |
| `mb`      | `marginBottom`      |
| `ml`      | `marginLeft`        |
| `my`      | `marginVertical`    |
| `mx`      | `marginHorizontal`  |
| `ms`      | `marginStart`       |
| `me`      | `marginEnd`         |
| `p`       | `padding`           |
| `pt`      | `paddingTop`        |
| `pr`      | `paddingRight`      |
| `pb`      | `paddingBottom`     |
| `pl`      | `paddingLeft`       |
| `py`      | `paddingVertical`   |
| `px`      | `paddingHorizontal` |
| `ps`      | `paddingStart`      |
| `pe`      | `paddingEnd`        |

```ts
import { Text, TextProps, View, ViewProps } from 'react-native';

import { createBox } from './theme';

const Box = createBox<ViewProps>(View);

const Title = createBox<TextProps>(Text);
```

### `Theme.createStyles(styles)`

```ts
createStyles(styles: Record<string, Style>)
```

Theme size mapping is available on longhand spacing properties only:

```ts
type SpacingStyle<S extends Sizes> = Partial<
  Record<
    | 'margin'
    | 'marginTop'
    | 'marginRight'
    | 'marginBottom'
    | 'marginLeft'
    | 'marginHorizontal'
    | 'marginVertical'
    | 'marginStart'
    | 'marginEnd'
    | 'padding'
    | 'paddingTop'
    | 'paddingRight'
    | 'paddingBottom'
    | 'paddingLeft'
    | 'paddingHorizontal'
    | 'paddingVertical'
    | 'paddingStart'
    | 'paddingEnd'
    | 'gap'
    | 'columnGap'
    | 'rowGap',
    keyof S
  >
>;
```

The following "color" properties only accept color names from the Theme:

- `backgroundColor`
- `borderColor`
- `color`
- `tintColor`

All other top-level color properties also only accept theme color names: `borderTopColor`,
`borderRightColor`, `borderBottomColor`, `borderLeftColor`, `borderStartColor`,
`borderEndColor`, `borderBlockColor`, `borderBlockStartColor`, `borderBlockEndColor`,
`shadowColor`, `textShadowColor`, `textDecorationColor`, `overlayColor`, and
`outlineColor`. Declare literal colors (including platform colors) in the theme
and reference them by name. Literal values and unknown theme names are rejected
by TypeScript; unchecked invalid values are omitted with a warning in development.

The following "size" properties only accept size names from the Theme:

- `borderRadius`
- any property from `SpacingStyle` above

```ts
import { createStyles } from './theme';

const $ = createStyles({
  card: {
    backgroundColor: 'primary',
    borderRadius: 'roundness',
    padding: 'm',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
```

### `Theme.createVariants(defaults, variants, modifiers)`

```ts
createVariants(defaults: Style, variants: Record<string, Style>, modifiers: Record<string, Style>)
```

`createVariants` returns a function helper to easily pick a component "variant" style:

```ts
import { createVariants } from './theme';

const $ = createVariants(
  // defaults
  {
    borderWidth: 1,
  },
  // variants
  {
    primary: {
      borderColor: 'primary',
    },
    accent: {
      borderColor: 'accent',
    },
  },
  // modifiers
  {
    disabled: {
      opacity: 0.5,
    },
  },
);

$('primary', { disabled: false }); // --> [{ borderWidth: 1}, { borderColor: colors.primary }]

$('accent', { disabled: true }); // --> [{ borderWidth: 1}, { borderColor: colors.accent }, { opacity: 0.5 }]

$('secondary', { disabled: true }); // TS error (variant not found)

$('primary', { compact: true }); // TS error (modifier not found)
```
