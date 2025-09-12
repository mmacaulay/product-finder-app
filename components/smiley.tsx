import Animated from 'react-native-reanimated';

export function Smiley() {
  return (
    <Animated.Text
      style={{
        fontSize: 28,
        lineHeight: 32,
        marginTop: -6,
        animationName: {
          '0%': { transform: [{ scale: 1 }] },
          '50%': { transform: [{ scale: 1.1 }] },
          '100%': { transform: [{ scale: 1 }] },
        },
        animationIterationCount: 2,
        animationDuration: '400ms',
      }}>
      😊
    </Animated.Text>
  );
}

