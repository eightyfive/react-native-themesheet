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

`createStyles` allows you to create normal `react-native` styles with spacing shorthands & Theme color mapping.

```ts
// src/views/home.tsx

import { createStyles } from './theme';

const $ = createStyles({
  container: {
    backgroundColor: 'primary', // <-- color name
    borderColor: 'accent', // <-- color name
    borderRadius: 'roundness', // <-- size name
    px: 's', // <-- `paddingHorizontal` shorthand + size name
    my: 'm', // <-- `marginVertical` shorthand + size name
    marginLeft: 30, // <-- no shorthand, normal `number` value
    col: 5, // <-- Flex positioning (see API)
  },
  text: {
    color: 'onPrimary', // <-- color name
    pl: 'l', // <-- `paddingLeft` shorthand + size name
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
    p: 'm',
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
      p: 's',
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

import { Col, Text, Title } from '../lib';

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

A `Style` accepts all normal `react-native` style properties as well as `FlexStyle` & `SpacingStyle` properties:

```ts
type FlexStyle = {
  col?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
  row?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
};

type SpacingStyle<S extends Sizes> = Partial<Record<SpacingProp, keyof S>>;
```

The following "color" properties will only accepts color names from the Theme:

- `backgroundColor`
- `borderColor`
- `color`
- `tintColor`

Finally `borderRadius` accepts both a size name from the Theme, as well as a normal `number` value.

```ts
import { createStyles } from './theme';

const $ = createStyles({
  card: {
    col: 5,
    backgroundColor: 'primary',
    borderRadius: 'roundness', // | 100
    p: 'm',
  },
});
```

#### Note about `FlexStyle`

A `FlexStyle` is a shorthand describing Flexbox properties.

It's based on the clever "dial" idea initially brought by [`react-native-row`](https://github.com/hyrwork/react-native-row).

Basically you can think of a Flex container as a dial number pad:

```
┌─────────────┐
│ 1    2    3 │
│             │
│ 4    5    6 │
│             │
│ 7    8    9 │
└─────────────┘
```

And when creating styles using the `{ (col|row): [1-9] }` shorthand, it will generate the corresponding Flexbox style:

```ts
const $ = createStyles({
  colC: {
    col: 5,
  },
  // $.colC = { flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }

  rowBR: {
    row: 9,
  },
  // $.rowL = { flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'flex-end' }

  rowLR: {
    row: 4,
    justifyContent: 'space-between',
  },
  // $.rowLR = { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }

  colLRB: {
    col: 8,
    alignItems: 'stretch',
  },
  // $.colLRB = { flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'stretch' }
});
```

For an even more semantic way to express Flexbox positioning, check out [`react-native-col`](https://github.com/eightyfive/react-native-col).

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
