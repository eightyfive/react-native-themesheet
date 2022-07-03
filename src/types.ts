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

export type SpacingProp = MarginProp | PaddingProp;

export type SpacingName = MarginName | PaddingName;

export type Colors = Record<string, ColorValue>;

export type Sizes = Record<string, number>;

export type Theme = {
  colors: Record<string, ColorValue>;
  sizes: Record<string, number>;
};

export type SpacingStyle<S extends Sizes> = Partial<
  Record<SpacingProp, keyof S>
>;

export type FlexStyle = {
  col?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
  row?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
};

export interface ViewStyle<S extends Sizes, C extends Colors>
  extends FlexStyle,
    SpacingStyle<S>,
    Omit<RNViewStyle, 'backgroundColor' | 'borderColor' | 'borderRadius'> {
  backgroundColor?: keyof C;
  borderColor?: keyof C;
  borderRadius?: keyof S | number;
}

export interface TextStyle<S extends Sizes, C extends Colors>
  extends FlexStyle,
    SpacingStyle<S>,
    Omit<RNTextStyle, 'backgroundColor' | 'borderColor' | 'color'> {
  backgroundColor?: keyof C;
  borderColor?: keyof C;
  color?: keyof C;
}

export interface ImageStyle<S extends Sizes, C extends Colors>
  extends FlexStyle,
    SpacingStyle<S>,
    Omit<RNImageStyle, 'backgroundColor' | 'borderColor'> {
  backgroundColor?: keyof C;
  borderColor?: keyof C;
}

export type RNStyle = RNViewStyle | RNTextStyle | RNImageStyle;

export type Style<S extends Sizes, C extends Colors> =
  | ViewStyle<S, C>
  | TextStyle<S, C>
  | ImageStyle<S, C>;

export type NamedStyles<S extends Sizes, C extends Colors, T> = {
  [P in keyof T]: Style<S, C>;
};
