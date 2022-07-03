import React, { PropsWithChildren } from 'react';
import { TextProps } from 'react-native';
import { createTheme } from './index';

const { createBox } = createTheme(
  {},
  {
    s: 4,
    m: 8,
    l: 16,
    roundness: 10,
  },
);

test('box', () => {
  type ButtonProps = PropsWithChildren;

  function ButtonInner(props: ButtonProps) {
    return null;
  }

  const Button = createBox<ButtonProps>(ButtonInner);

  type CaptionProps = TextProps;

  function CaptionInner(props: CaptionProps) {
    return null;
  }

  const Caption = createBox<CaptionProps>(CaptionInner);

  function Test() {
    return (
      <>
        <Caption mb="l" style={{ color: 'red' }}>
          Test
        </Caption>
        <Button mb="m">Yeah</Button>
      </>
    );
  }
});
