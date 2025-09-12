import * as Haptics from 'expo-haptics';

export function useHaptic() {
  return {
    selection: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light),
    success: () => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success),
    warning: () => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning),
    error: () => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error),
  };
}
