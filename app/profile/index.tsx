import { useState } from "react";
import { Linking, Pressable, ScrollView, StyleSheet, View } from "react-native";
import { useRouter } from "expo-router";
import Constants from "expo-constants";
import { Ionicons } from "@expo/vector-icons";
import { Theme } from "@/constants/theme";
import { useTheme, useThemedStyles } from "@/hooks/useTheme";
import { useMe } from "@/hooks/useMe";
import { signOut } from "@/services/authService";
import { confirm } from "@/utils/confirm";
import Screen from "@/components/ui/Screen";
import Header from "@/components/ui/Header";
import AppText from "@/components/ui/AppText";
import Avatar from "@/components/ui/Avatar";
import Button from "@/components/ui/Button";
import { IconName } from "@/components/ui/IconButton";
import { Skeleton } from "@/components/ui/States";

export default function ProfileScreen() {
  const router = useRouter();
  const { dark } = useTheme();
  const styles = useThemedStyles(makeStyles);
  const { me, status } = useMe();
  const [signingOut, setSigningOut] = useState(false);

  const handleSignOut = async () => {
    const ok = await confirm({
      title: "Se déconnecter ?",
      message: "Votre accès à Trello sera révoqué sur cet appareil.",
      confirmLabel: "Se déconnecter",
    });
    if (!ok) return;
    setSigningOut(true);
    await signOut();
    router.replace("/onboarding/token");
  };

  return (
    <Screen>
      <Header title="Profil" />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.identity}>
          {status === "loading" ? (
            <>
              <Skeleton width={96} height={96} radius={48} />
              <Skeleton width={160} height={24} />
              <Skeleton width={100} height={16} />
            </>
          ) : (
            <>
              <View style={styles.avatarRing}>
                <Avatar member={me} size={96} />
              </View>
              <AppText variant="title" align="center">
                {me?.fullName || "—"}
              </AppText>
              <AppText color="textMuted">@{me?.username ?? "—"}</AppText>
            </>
          )}
        </View>

        <View style={styles.group}>
          <Row icon="person-outline" label="Nom complet" value={me?.fullName} />
          <Row icon="at-outline" label="Nom d'utilisateur" value={me?.username ? `@${me.username}` : undefined} />
          {me?.email ? <Row icon="mail-outline" label="Email" value={me.email} /> : null}
        </View>

        <View style={styles.group}>
          <Row
            icon="open-outline"
            label="Ouvrir Trello"
            value="trello.com"
            onPress={() => Linking.openURL(me?.username ? `https://trello.com/u/${me.username}` : "https://trello.com")}
          />
          <Row icon={dark ? "moon-outline" : "sunny-outline"} label="Apparence" value="Automatique (système)" />
          <Row icon="information-circle-outline" label="Version" value={Constants.expoConfig?.version ?? "—"} />
        </View>

        <Button label="Se déconnecter" icon="log-out-outline" variant="danger" size="lg" onPress={handleSignOut} loading={signingOut} />
      </ScrollView>
    </Screen>
  );
}

type RowProps = { icon: IconName; label: string; value?: string; onPress?: () => void };

function Row({ icon, label, value, onPress }: RowProps) {
  const { colors } = useTheme();
  const styles = useThemedStyles(makeStyles);

  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      accessibilityRole={onPress ? "link" : undefined}
      style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
    >
      <View style={styles.rowIcon}>
        <Ionicons name={icon} size={18} color={colors.primary} />
      </View>
      <View style={styles.rowText}>
        <AppText variant="caption" color="textMuted">
          {label}
        </AppText>
        <AppText variant="bodyStrong" numberOfLines={1}>
          {value ?? "—"}
        </AppText>
      </View>
      {onPress ? <Ionicons name="chevron-forward" size={18} color={colors.textSubtle} /> : null}
    </Pressable>
  );
}

const makeStyles = ({ colors, radius, spacing }: Theme) =>
  StyleSheet.create({
    content: {
      paddingHorizontal: spacing.lg + 4,
      paddingBottom: spacing.xxxl,
      gap: spacing.xl,
      maxWidth: 560,
      width: "100%",
      alignSelf: "center",
    },
    identity: { alignItems: "center", gap: spacing.sm, paddingVertical: spacing.lg },
    avatarRing: {
      padding: 4,
      borderRadius: radius.pill,
      borderWidth: 2,
      borderColor: colors.primary,
      marginBottom: spacing.sm,
    },
    group: {
      backgroundColor: colors.surface,
      borderRadius: radius.lg + 4,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: colors.border,
      overflow: "hidden",
    },
    row: { flexDirection: "row", alignItems: "center", gap: spacing.md, padding: spacing.lg, minHeight: 64 },
    rowPressed: { backgroundColor: colors.surfaceMuted },
    rowIcon: {
      width: 36,
      height: 36,
      borderRadius: radius.sm + 2,
      backgroundColor: colors.primarySoft,
      alignItems: "center",
      justifyContent: "center",
    },
    rowText: { flex: 1, gap: 2 },
  });
