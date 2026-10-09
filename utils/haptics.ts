import * as Haptics from "expo-haptics";
import { Platform } from "react-native";

const enabled = Platform.OS === "ios" || Platform.OS === "android";

/** Retours haptiques discrets ; ignorés sur le web et en cas d'échec. */
export const haptics = {
  tap: () => {
    if (enabled) Haptics.selectionAsync().catch(() => {});
  },
  success: () => {
    if (enabled) Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
  },
  warning: () => {
    if (enabled) Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning).catch(() => {});
  },
};
