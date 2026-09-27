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
  | 'borderTopColor'
  | 'borderRightColor'
  | 'borderBottomColor'
  | 'borderLeftColor'
  | 'borderStartColor'
  | 'borderEndColor'
  | 'borderBlockColor'
  | 'borderBlockStartColor'
  | 'borderBlockEndColor'
  | 'shadowColor'
  | 'textShadowColor'
  | 'textDecorationColor'
  | 'overlayColor'
  | 'outlineColor'
  | 'backgroundColor'
  | 'borderColor'
  | 'color'
  | 'tintColor';

export type ThemeSizeProp = SpacingName | 'borderRadius';

type ThemeColors<C extends Colors> = Partial<Record<ThemeColorProp, keyof C>>;

export interface ViewStyle<S extends Sizes, C extends Colors>
  extends SpacingStyle<S>,
    ThemeColors<C>,
    Omit<RNViewStyle, ThemeColorProp | 'borderRadius' | SpacingName> {
  borderRadius?: keyof S;
}

export interface TextStyle<S extends Sizes, C extends Colors>
  extends SpacingStyle<S>,
    ThemeColors<C>,
    Omit<RNTextStyle, ThemeColorProp | 'borderRadius' | SpacingName> {
  borderRadius?: keyof S;
}

export interface ImageStyle<S extends Sizes, C extends Colors>
  extends SpacingStyle<S>,
    ThemeColors<C>,
    Omit<RNImageStyle, ThemeColorProp | 'borderRadius' | SpacingName> {
  borderRadius?: keyof S;
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

export type NamedStyle<
  S extends Sizes,
  C extends Colors,
  T extends object,
> = Exclude<keyof T, StyleKey<S, C>> extends never
  ? T extends Style<S, C>
    ? T
    : Style<S, C>
  : T & KnownStyleKeys<S, C, T>;

type OutputStyleValue<K extends PropertyKey, V> = K extends ThemeColorProp
  ? ColorValue
  : K extends ThemeSizeProp
  ? number
  : K extends keyof RNTextStyle
  ? RNTextStyle[K]
  : K extends keyof RNImageStyle
  ? RNImageStyle[K]
  : K extends keyof RNViewStyle
  ? RNViewStyle[K]
  : V;

type OutputSharedNamedStyle<T extends object> = {
  [P in keyof T]: OutputStyleValue<P, T[P]>;
};

export type AnyNamedStyles<
  S extends Sizes,
  C extends Colors,
  T extends Record<string, object>,
> = {
  [P in keyof T]: NamedStyle<S, C, T[P]>;
};

export type OutputNamedStyles<T extends Record<string, object>> = {
  [P in keyof T]: OutputSharedNamedStyle<T[P]>;
};

export type BoxProps<S extends Sizes> = Partial<Record<SpacingProp, keyof S>>;
