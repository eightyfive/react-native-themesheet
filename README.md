# `react-native-themesheet`

Lightweight alternative to [@shopify/restyle](https://github.com/Shopify/restyle).

## Install

```bash
yarn add react-native-themesheet
```

## Usage

### Create theme

A "Theme" consist of a set of `colors` & a set of `sizes`.

```ts
// src/views/theme.ts

export const { colors, createBox, createStyles, createVariants, sizes } =
  createTheme(
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

`createStyles` allows you to create normal react-native `StyleSheet` styles with spacing shorthands & theme color mapping.

```ts
// src/views/home.tsx

import { createStyles } from './theme';

export function Home(props) {
  return (
    <View style={$.container}>
      <Text style={$.text}>Hello !</Text>
    </View>
  );
}

const $ = createStyles({
  container: {
    backgroundColor: 'primary', // <-- color name
    borderColor: 'accent',
    borderRadius: 'roundness',
    px: 's', // <-- `paddingHorizontal` shorthand + size name
    my: 'm', // <-- `marginVertical` shorthand
    marginLeft: 30, // <-- no shorthand, normal `number` value
    col: 5, // <-- Flex positioning (see API)
  },
  text: {
    color: 'onPrimary', // <-- color name
    px: 'l',
  },
});
```

### Create variants

`createVariants` allows you to easily pick a component "variant" style.

```ts
// src/views/lib/button.tsx

import { createVariants } from '../theme';

type Props = {
  children: string;
  compact?: boolean;
  disabled?: boolean;
  loading?: boolean;
  variant?: 'primary' | 'accent' | 'secondary';
};

function Button({
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
  //   <primary style>,
  //   (disabled || loading) && <disabled style>,
  //   compact && <compact style>
  // ]

  return (
    <Pressable style={styles}>
      <Text>{children}</Text>
    </Pressable>
  );
}

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
```

### Create box

`createBox` enhance a component with spacing shorthand properties.

Let's make a simple UI `lib`.

A simple `Row` component:

```ts
// src/views/lib/row.tsx

import { View, ViewProps } from 'react-native';

import { createBox, createStyles } from '../theme';

type Props = ViewProps;

function RowInner({ style, ...rest }: Props) {
  return <View {...rest} style={[$.row, style]} />;
}

export const Row = createBox<Props>(RowInner);

const $ = createStyles({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
```

Our app `Text` component:

```ts
// src/views/lib/text.tsx

import { Text as RNText, TextProps } from 'react-native';

import { createBox } from '../theme';

export const Text = createBox<TextProps>(RNText);
```

Let's centralize `lib` imports...

```ts
// src/views/lib/index.ts

export * from './row';
export * from './text';
```

Later in app:

```ts
// src/views/menu.tsx

import { Row, Text } from './lib';

function Menu() {
  return (
    <Row p="m" mb="l">
      <Text px="s">Item 1</Text>
      <Text px="s">Item 2</Text>
      <Text px="s">Item 3</Text>
    </Row>
  );
}
```

## API

### `createTheme(colors: Colors, sizes: Sizes)`

This is the only public API available. All utility functions are exported from it.

```ts
const { colors, createBox, createStyles, createVariants, sizes } = createTheme(
  {
    primary: 'black',
    accent: 'white',
  },
  {
    s: 4,
    m: 8,
  },
);
```

### `createBox<BaseComponentProps>(BaseComponent: ComponentType<any>)`

Enhance `BaseComponent` with spacing shorthand properties:

| Shorthand | Property          |
| --------- | ----------------- |
| m         | margin            |
| mt        | marginTop         |
| mr        | marginRight       |
| mb        | marginBottom      |
| ml        | marginLeft        |
| my        | marginVertical    |
| mx        | marginHorizontal  |
| ms        | marginStart       |
| me        | marginEnd         |
| p         | padding           |
| pt        | paddingTop        |
| pr        | paddingRight      |
| pb        | paddingBottom     |
| pl        | paddingLeft       |
| py        | paddingVertical   |
| px        | paddingHorizontal |
| ps        | paddingStart      |
| pe        | paddingEnd        |

```ts
import { Text, TextProps, View, ViewProps } from 'react-native';

const Box = createBox<ViewProps>(View);

const Title = createBox<TextProps>(Text);
```

### `createStyles(styles: Record<string, Style>)`

A `Style` accepts all normal react-native style properties as well as `FlexStyle` & `SpacingStyle` properties:

```ts
type FlexStyle = {
  col?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
  row?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
};

type SpacingStyle<S extends Sizes> = Partial<Record<SpacingProp, keyof S>>;
```

Also, the following "color" properties will only accepts color names from the "Theme":

- `backgroundColor`
- `borderColor`
- `color`
- `tintColor`

Finally, `borderRadius` accepts both a size name from the "Theme", as well as a normal `number` value.

```ts
const $ = createStyles({
  container: {
    col: 5
    backgroundColor: 'primary',
    borderRadius: 'roundness',
    p: 'm',
  },
});
```

#### `FlexStyle`

A `FlexStyle` is a shorthand describing Flex properties.

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

And when creating styles using the `{ (col|row): 1 | 2 .. 9 }` shorthand, it will generate the corresponding Flex style:

```ts
const $ = createStyles({
  colC: {
    col: 5,
  },
  // $.colC = { flexDirection: 'col', justifyContent: 'center', alignItems: 'center' }

  rowC: {
    row: 5,
  },
  // $.rowC = { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }

  rowL: {
    row: 4,
  },
  // $.rowL = { flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }

  colB: {
    col: 8,
  },
  // $.colB = { flexDirection: 'col', justifyContent: 'flex-end', alignItems: 'center' }

  rowLR: {
    row: 4,
    justifyContent: 'space-between',
  },
  // $.rowLR = { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }

  colLRB: {
    col: 8,
    alignItems: 'stretch',
  },
  // $.colLRB = { flexDirection: 'col', justifyContent: 'flex-end', alignItems: 'stretch' }
});
```

For an even more semantic way to express Flex positioning, check out [`react-native-col`](https://github.com/eightyfive/react-native-col).

### `createVariants(defaults: Style, variants: Record<string, Style>, modifiers: Record<string, Style>)`

`createVariants` returns a function helper to easily pick a component "variant" style:

```ts
const $ = createVariants(
  // defaults
  {
    borderWidth: 1,
  },
  // variants
  {
    primary: {
      borderColor: 'onPrimary',
    },
    accent: {
      borderColor: 'onAccent',
    },
  },
  // modifiers
  {
    disabled: {
      opacity: 0.5,
    },
  },
);

$('primary', { disabled: false }); // --> [{ borderWidth: 1}, { borderColor: colors.onPrimary }]

$('accent', { disabled: true }); // --> [{ borderWidth: 1}, { borderColor: colors.onAccent }, { opacity: 0.5 }]

$('secondary', {}); // TS error (variant not found)

$('primary', { compact: true }); // TS error (modifier not found)
```
