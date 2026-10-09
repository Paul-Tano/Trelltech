import { createContext, ReactNode, useCallback, useContext, useMemo, useRef, useState } from "react";
import { StyleSheet, View } from "react-native";
import Animated, { FadeInUp, FadeOutUp } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { Theme } from "@/constants/theme";
import { useTheme, useThemedStyles } from "@/hooks/useTheme";
import { haptics } from "@/utils/haptics";
import AppText from "./AppText";

type ToastType = "success" | "error" | "info";
type ToastState = { id: number; type: ToastType; message: string };

type ToastApi = {
  success: (message: string) => void;
  error: (message: string) => void;
  info: (message: string) => void;
};

const ToastContext = createContext<ToastApi | null>(null);

export function useToast(): ToastApi {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast doit être utilisé dans <ToastProvider>.");
  return context;
}

/** Notifications éphémères : succès d'une action ou échec non bloquant. */
export function ToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<ToastState | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const show = useCallback((type: ToastType, message: string) => {
    if (timer.current) clearTimeout(timer.current);
    if (type === "error") haptics.warning();
    setToast({ id: Date.now(), type, message });
    timer.current = setTimeout(() => setToast(null), type === "error" ? 4000 : 2500);
  }, []);

  const api = useMemo<ToastApi>(
    () => ({
      success: (message) => show("success", message),
      error: (message) => show("error", message),
      info: (message) => show("info", message),
    }),
    [show],
  );

  return (
    <ToastContext.Provider value={api}>
      {children}
      {toast ? <ToastView key={toast.id} toast={toast} /> : null}
    </ToastContext.Provider>
  );
}

function ToastView({ toast }: { toast: ToastState }) {
  const { colors } = useTheme();
  const styles = useThemedStyles(makeStyles);
  const insets = useSafeAreaInsets();

  const { icon, tint } = {
    success: { icon: "checkmark-circle" as const, tint: colors.success },
    error: { icon: "alert-circle" as const, tint: colors.danger },
    info: { icon: "information-circle" as const, tint: colors.primary },
  }[toast.type];

  return (
    <View pointerEvents="none" style={[styles.host, { top: insets.top + 8 }]}>
      <Animated.View
        entering={FadeInUp.springify().damping(18)}
        exiting={FadeOutUp.duration(150)}
        style={styles.toast}
        accessibilityRole="alert"
        accessibilityLiveRegion="polite"
      >
        <Ionicons name={icon} size={20} color={tint} />
        <AppText variant="caption" style={styles.message}>
          {toast.message}
        </AppText>
      </Animated.View>
    </View>
  );
}

const makeStyles = ({ colors, radius, spacing, shadows }: Theme) =>
  StyleSheet.create({
    host: { position: "absolute", left: spacing.lg, right: spacing.lg, alignItems: "center" },
    toast: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.sm,
      maxWidth: 480,
      backgroundColor: colors.surface,
      borderRadius: radius.lg,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: colors.border,
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.md,
      ...shadows.raised,
      shadowColor: colors.shadow,
      shadowOpacity: 0.15,
    },
    message: { flexShrink: 1, color: colors.text },
  });
