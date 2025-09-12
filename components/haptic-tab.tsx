import { BottomTabBarButtonProps } from '@react-navigation/bottom-tabs';
import { Pressable } from 'react-native';

import { useHaptic } from '@/hooks/use-haptic';

export function HapticTab(props: BottomTabBarButtonProps) {
  const haptic = useHaptic();

  return (
    <Pressable
      {...(props as any)}
      onPressIn={(ev) => {
        props.onPressIn?.(ev);
        haptic.selection();
      }}
    />
  );
}
