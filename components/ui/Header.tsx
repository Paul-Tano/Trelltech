import { ReactNode } from "react";
import { StyleSheet, View } from "react-native";
import { useRouter } from "expo-router";
import { Theme } from "@/constants/theme";
import { useThemedStyles } from "@/hooks/useTheme";
import AppText from "./AppText";
import IconButton from "./IconButton";

type Props = {
  title: string;
  subtitle?: string;
  /** Affiche un bouton retour (par défaut : oui). */
  back?: boolean;
  right?: ReactNode;
  /** En-tête posé sur une couleur (ex. couleur du board) : textes et icônes en blanc. */
  onColor?: boolean;
};

export default function Header({ title, subtitle, back = true, right, onColor }: Props) {
  const router = useRouter();
  const styles = useThemedStyles(makeStyles);

  return (
    <View style={styles.header}>
      {back ? (
        <IconButton
          icon="chevron-back"
          accessibilityLabel="Retour"
          variant={onColor ? "onColor" : "soft"}
          onPress={() => (router.canGoBack() ? router.back() : router.replace("/workspaces"))}
        />
      ) : null}
      <View style={styles.titles}>
        <AppText
          variant="headline"
          numberOfLines={1}
          accessibilityRole="header"
          style={onColor ? styles.onColor : undefined}
        >
          {title}
        </AppText>
        {subtitle ? (
          <AppText
            variant="caption"
            color="textMuted"
            numberOfLines={1}
            style={onColor ? styles.onColorMuted : undefined}
          >
            {subtitle}
          </AppText>
        ) : null}
      </View>
      <View style={styles.right}>{right}</View>
    </View>
  );
}

const makeStyles = ({ spacing }: Theme) =>
  StyleSheet.create({
    header: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.md,
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.md,
      minHeight: 64,
    },
    titles: { flex: 1, gap: 1 },
    right: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
    onColor: { color: "#FFFFFF" },
    onColorMuted: { color: "rgba(255,255,255,0.85)" },
  });
