import {
  ColorValue,
  ImageStyle as RNImageStyle,
  TextStyle as RNTextStyle,
  ViewStyle as RNViewStyle,
} from 'react-native';

export type MarginProp =
  | 'm'
  | 'mt'
  | 'mr'
  | 'mb'
  | 'ml'
  | 'mx'
  | 'my'
  | 'ms'
  | 'me';

export type PaddingProp =
  | 'p'
  | 'pt'
  | 'pr'
  | 'pb'
  | 'pl'
  | 'px'
  | 'py'
  | 'ps'
  | 'pe';

export type GapProp = 'g' | 'gx' | 'gy';

export type SpacingProp = MarginProp | PaddingProp | GapProp;

export type MarginName =
  | 'margin'
  | 'marginTop'
  | 'marginRight'
  | 'marginBottom'
  | 'marginLeft'
  | 'marginHorizontal'
  | 'marginVertical'
  | 'marginStart'
  | 'marginEnd';

export type PaddingName =
  | 'padding'
  | 'paddingTop'
  | 'paddingRight'
  | 'paddingBottom'
  | 'paddingLeft'
  | 'paddingHorizontal'
  | 'paddingVertical'
  | 'paddingStart'
  | 'paddingEnd';

export type GapName = 'gap' | 'columnGap' | 'rowGap';

export type SpacingName = MarginName | PaddingName | GapName;

export type Colors = Record<string, ColorValue>;

export type Sizes = Record<string, number>;

export type SpacingStyle<S extends Sizes> = Partial<
  Record<SpacingName, keyof S>
>;

export type ThemeColorProp =
  | 'backgroundColor'
  | 'borderColor'
  | 'color'
  | 'tintColor';

export type ThemeSizeProp = SpacingName | 'borderRadius';

export interface ViewStyle<S extends Sizes, C extends Colors>
  extends SpacingStyle<S>,
    Omit<
      RNViewStyle,
      'backgroundColor' | 'borderColor' | 'borderRadius' | SpacingName
    > {
  backgroundColor?: keyof C;
  borderColor?: keyof C;
  borderRadius?: keyof S;
}

export interface TextStyle<S extends Sizes, C extends Colors>
  extends SpacingStyle<S>,
    Omit<
      RNTextStyle,
      'backgroundColor' | 'borderColor' | 'borderRadius' | 'color' | SpacingName
    > {
  backgroundColor?: keyof C;
  borderColor?: keyof C;
  borderRadius?: keyof S;
  color?: keyof C;
}

export interface ImageStyle<S extends Sizes, C extends Colors>
  extends SpacingStyle<S>,
    Omit<
      RNImageStyle,
      | 'backgroundColor'
      | 'borderColor'
      | 'borderRadius'
      | 'tintColor'
      | SpacingName
    > {
  backgroundColor?: keyof C;
  borderColor?: keyof C;
  borderRadius?: keyof S;
  tintColor?: keyof C;
}

export type RNStyle = RNViewStyle | RNTextStyle | RNImageStyle;

export type Style<S extends Sizes, C extends Colors> =
  | ViewStyle<S, C>
  | TextStyle<S, C>
  | ImageStyle<S, C>;

type StyleKey<S extends Sizes, C extends Colors> =
  | keyof ViewStyle<S, C>
  | keyof TextStyle<S, C>
  | keyof ImageStyle<S, C>;

type KnownStyleKeys<S extends Sizes, C extends Colors, T extends object> = {
  [P in Exclude<keyof T, StyleKey<S, C>>]: never;
};

export type NamedStyle<S extends Sizes, C extends Colors, T extends object> =
  Exclude<keyof T, StyleKey<S, C>> extends never
    ? T extends Style<S, C>
      ? T
      : Style<S, C>
    : T & KnownStyleKeys<S, C, T>;

type HasMatchingKey<T, K extends PropertyKey> = Extract<
  keyof T,
  K
> extends never
  ? false
  : true;

type TextOnlyStyleKey<S extends Sizes, C extends Colors> = Exclude<
  keyof TextStyle<S, C>,
  keyof ViewStyle<S, C> | keyof ImageStyle<S, C>
>;

type ImageOnlyStyleKey<S extends Sizes, C extends Colors> = Exclude<
  keyof ImageStyle<S, C>,
  keyof ViewStyle<S, C> | keyof TextStyle<S, C>
>;

type InferredOutputNamedStyle<
  S extends Sizes,
  C extends Colors,
  T extends object,
> = HasMatchingKey<T, ImageOnlyStyleKey<S, C>> extends true
  ? HasMatchingKey<T, TextOnlyStyleKey<S, C>> extends true
    ? never
    : RNImageStyle
  : HasMatchingKey<T, TextOnlyStyleKey<S, C>> extends true
  ? RNTextStyle
  : OutputSharedNamedStyle<T>;

type OutputStyleValue<
  K extends PropertyKey,
  V,
> = K extends ThemeColorProp
  ? ColorValue
  : K extends ThemeSizeProp
  ? number
  : V;

type OutputSharedNamedStyle<T extends object> = {
  [P in keyof T]: OutputStyleValue<P, T[P]>;
};

type OutputNamedStyle<
  S extends Sizes,
  C extends Colors,
  T extends object,
> = T extends object ? InferredOutputNamedStyle<S, C, T> : never;

export type AnyNamedStyles<
  S extends Sizes,
  C extends Colors,
  T extends Record<string, object>,
> = {
  [P in keyof T]: NamedStyle<S, C, T[P]>;
};

export type OutputNamedStyles<
  S extends Sizes,
  C extends Colors,
  T extends Record<string, object>,
> = {
  [P in keyof T]: OutputNamedStyle<S, C, T[P]>;
};

export type BoxProps<S extends Sizes> = {
  [Key in SpacingProp]?: keyof S;
};
