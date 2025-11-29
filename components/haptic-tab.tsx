import { BottomTabBarButtonProps } from '@react-navigation/bottom-tabs';
import { GestureResponderEvent, Pressable } from 'react-native';

import { useHaptic } from '@/hooks/use-haptic';

export function HapticTab(props: BottomTabBarButtonProps) {
  const haptic = useHaptic();

  const handlePressIn = (ev: GestureResponderEvent) => {
    if (props.onPressIn) {
      props.onPressIn(ev);
    }
    haptic.selection();
  };

  return (
    <Pressable
      {...props}
      onPressIn={handlePressIn}
    />
  );
}
