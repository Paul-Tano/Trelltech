import { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Theme } from "@/constants/theme";
import { useTheme, useThemedStyles } from "@/hooks/useTheme";
import { isAuthConfigured, signInWithTrello } from "@/services/authService";
import { errorMessage } from "@/utils/errors";
import { haptics } from "@/utils/haptics";
import Screen from "@/components/ui/Screen";
import AppText from "@/components/ui/AppText";
import Button from "@/components/ui/Button";
import BrandMark from "@/components/ui/BrandMark";
import { IconName } from "@/components/ui/IconButton";

const FEATURES: { icon: IconName; title: string; text: string }[] = [
  { icon: "albums-outline", title: "Vos espaces de travail", text: "Retrouvez toutes vos équipes au même endroit." },
  { icon: "grid-outline", title: "Des boards lisibles", text: "Listes, cartes, étiquettes et échéances en un coup d'œil." },
  { icon: "people-outline", title: "Le travail d'équipe", text: "Assignez des membres et déplacez les cartes en un geste." },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const styles = useThemedStyles(makeStyles);
  const { expired } = useLocalSearchParams<{ expired?: string }>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(
    isAuthConfigured ? null : "Cette version de l'app n'est pas configurée (clé API Trello manquante).",
  );

  const signIn = async () => {
    setError(null);
    setLoading(true);
    try {
      const result = await signInWithTrello();
      if (result === "success") {
        haptics.success();
        router.replace("/workspaces");
        return;
      }
      setError("Connexion annulée. Vous pouvez réessayer quand vous voulez.");
    } catch (e) {
      setError(errorMessage(e, e instanceof Error ? e.message : "La connexion a échoué. Réessayez."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen edges={["top", "bottom"]}>
      <View style={styles.glowTop} />
      <View style={styles.glowBottom} />

      <ScrollView contentContainerStyle={styles.content} bounces={false}>
        <Animated.View entering={FadeInDown.duration(500).delay(100)} style={styles.hero}>
          <BrandMark />
          <AppText variant="display" align="center" style={styles.title}>
            TrellTech
          </AppText>
          <AppText color="textMuted" align="center" style={styles.subtitle}>
            Tous vos projets Trello, pensés pour le mobile.
          </AppText>
        </Animated.View>

        <View style={styles.features}>
          {FEATURES.map((feature, index) => (
            <Animated.View
              key={feature.title}
              entering={FadeInDown.duration(450).delay(250 + index * 100)}
              style={styles.feature}
            >
              <View style={styles.featureIcon}>
                <Ionicons name={feature.icon} size={20} color={colors.primary} />
              </View>
              <View style={styles.featureText}>
                <AppText variant="bodyStrong">{feature.title}</AppText>
                <AppText variant="caption" color="textMuted">
                  {feature.text}
                </AppText>
              </View>
            </Animated.View>
          ))}
        </View>

        <Animated.View entering={FadeInUp.duration(450).delay(600)} style={styles.bottom}>
          {expired && !error ? (
            <View style={[styles.notice, styles.noticeInfo]} accessibilityRole="alert">
              <Ionicons name="time-outline" size={18} color={colors.warning} />
              <AppText variant="caption" style={[styles.noticeText, { color: colors.warning }]}>
                Votre session a expiré. Reconnectez-vous pour continuer.
              </AppText>
            </View>
          ) : null}
          {error ? (
            <View style={[styles.notice, styles.noticeError]} accessibilityRole="alert">
              <Ionicons name="alert-circle-outline" size={18} color={colors.danger} />
              <AppText variant="caption" color="danger" style={styles.noticeText}>
                {error}
              </AppText>
            </View>
          ) : null}

          <Button
            label="Se connecter avec Trello"
            icon="log-in-outline"
            size="lg"
            onPress={signIn}
            loading={loading}
            disabled={!isAuthConfigured}
          />
          <View style={styles.privacy}>
            <Ionicons name="lock-closed-outline" size={14} color={colors.textSubtle} />
            <AppText variant="caption" color="textSubtle" align="center" style={styles.privacyText}>
              Accès en lecture et écriture pendant 30 jours. Votre token reste chiffré sur cet appareil.
            </AppText>
          </View>
        </Animated.View>
      </ScrollView>
    </Screen>
  );
}

const makeStyles = ({ colors, radius, spacing }: Theme) =>
  StyleSheet.create({
    glowTop: {
      position: "absolute",
      top: -120,
      right: -100,
      width: 320,
      height: 320,
      borderRadius: 160,
      backgroundColor: colors.primary,
      opacity: 0.08,
    },
    glowBottom: {
      position: "absolute",
      bottom: -100,
      left: -80,
      width: 260,
      height: 260,
      borderRadius: 130,
      backgroundColor: colors.primary,
      opacity: 0.06,
    },
    content: {
      flexGrow: 1,
      gap: spacing.xxl,
      justifyContent: "space-between",
      paddingHorizontal: spacing.xl,
      paddingTop: spacing.xxxl,
      paddingBottom: spacing.lg,
      maxWidth: 520,
      width: "100%",
      alignSelf: "center",
    },
    hero: { alignItems: "center", gap: spacing.md },
    title: { marginTop: spacing.lg },
    subtitle: { maxWidth: 280 },
    features: { gap: spacing.md },
    feature: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.lg,
      backgroundColor: colors.surface,
      borderRadius: radius.lg,
      padding: spacing.lg,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: colors.border,
    },
    featureIcon: {
      width: 44,
      height: 44,
      borderRadius: radius.md,
      backgroundColor: colors.primarySoft,
      alignItems: "center",
      justifyContent: "center",
    },
    featureText: { flex: 1, gap: 2 },
    bottom: { gap: spacing.lg },
    notice: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.sm,
      padding: spacing.md,
      borderRadius: radius.md,
    },
    noticeInfo: { backgroundColor: colors.warningSoft },
    noticeError: { backgroundColor: colors.dangerSoft },
    noticeText: { flex: 1 },
    privacy: { flexDirection: "row", gap: spacing.xs, justifyContent: "center", paddingHorizontal: spacing.lg },
    privacyText: { flexShrink: 1 },
  });
