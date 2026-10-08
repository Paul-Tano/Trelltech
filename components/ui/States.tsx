import { useEffect } from "react";
import { DimensionValue, StyleSheet, View, ViewStyle } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  FadeIn,
} from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { Theme } from "@/constants/theme";
import { useTheme, useThemedStyles } from "@/hooks/useTheme";
import AppText from "./AppText";
import Button from "./Button";
import { IconName } from "./IconButton";

type EmptyProps = {
  icon: IconName;
  title: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
};

/** État vide illustré, avec une action principale facultative. */
export function EmptyState({ icon, title, message, actionLabel, onAction }: EmptyProps) {
  const { colors } = useTheme();
  const styles = useThemedStyles(makeStyles);

  return (
    <Animated.View entering={FadeIn.duration(250)} style={styles.container}>
      <View style={styles.halo}>
        <View style={styles.iconCircle}>
          <Ionicons name={icon} size={30} color={colors.primary} />
        </View>
      </View>
      <AppText variant="headline" align="center">
        {title}
      </AppText>
      {message ? (
        <AppText color="textMuted" align="center" style={styles.message}>
          {message}
        </AppText>
      ) : null}
      {actionLabel && onAction ? (
        <Button label={actionLabel} icon="add" onPress={onAction} style={styles.action} />
      ) : null}
    </Animated.View>
  );
}

type ErrorProps = { message: string; onRetry: () => void };

/** Erreur de chargement bloquante, toujours accompagnée d'un « Réessayer ». */
export function ErrorState({ message, onRetry }: ErrorProps) {
  const { colors } = useTheme();
  const styles = useThemedStyles(makeStyles);

  return (
    <View style={styles.container} accessibilityRole="alert">
      <View style={[styles.iconCircle, { backgroundColor: colors.dangerSoft }]}>
        <Ionicons name="cloud-offline-outline" size={30} color={colors.danger} />
      </View>
      <AppText variant="headline" align="center">
        Oups, le chargement a échoué
      </AppText>
      <AppText color="textMuted" align="center" style={styles.message}>
        {message}
      </AppText>
      <Button label="Réessayer" icon="refresh" variant="secondary" onPress={onRetry} style={styles.action} />
    </View>
  );
}

type SkeletonProps = { width?: DimensionValue; height: number; radius?: number; style?: ViewStyle };

/** Bloc de chargement pulsé, à la forme du contenu attendu. */
export function Skeleton({ width = "100%", height, radius = 12, style }: SkeletonProps) {
  const { colors } = useTheme();
  const opacity = useSharedValue(0.5);

  useEffect(() => {
    opacity.value = withRepeat(withTiming(1, { duration: 700 }), -1, true);
  }, [opacity]);

  const animated = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return (
    <Animated.View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={[{ width, height, borderRadius: radius, backgroundColor: colors.surfaceMuted }, animated, style]}
    />
  );
}

const makeStyles = ({ colors, radius, spacing }: Theme) =>
  StyleSheet.create({
    container: {
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: spacing.xxl,
      paddingVertical: spacing.xxxl,
      gap: spacing.sm,
    },
    halo: {
      padding: spacing.md,
      borderRadius: radius.pill,
      backgroundColor: colors.primarySoft,
      opacity: 0.9,
      marginBottom: spacing.sm,
    },
    iconCircle: {
      width: 64,
      height: 64,
      borderRadius: 32,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.surface,
    },
    message: { maxWidth: 300 },
    action: { marginTop: spacing.lg, alignSelf: "center" },
  });
