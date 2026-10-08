import { ReactNode } from "react";
import { KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, StyleSheet, View } from "react-native";
import Animated, { FadeIn, SlideInDown } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Theme } from "@/constants/theme";
import { useThemedStyles } from "@/hooks/useTheme";
import AppText from "./AppText";
import IconButton from "./IconButton";

type Props = {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
};

/**
 * Feuille modale ancrée en bas de l'écran : remplace les 7 modales dupliquées.
 * Se ferme au tap sur le fond, via le bouton ✕ et via le bouton retour Android.
 */
export default function Sheet({ visible, onClose, title, children }: Props) {
  const styles = useThemedStyles(makeStyles);
  const insets = useSafeAreaInsets();

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onClose} statusBarTranslucent>
      <KeyboardAvoidingView style={styles.root} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <Animated.View entering={FadeIn.duration(180)} style={StyleSheet.absoluteFill}>
          <Pressable
            style={styles.backdrop}
            onPress={onClose}
            accessibilityRole="button"
            accessibilityLabel="Fermer"
          />
        </Animated.View>

        <Animated.View
          entering={SlideInDown.springify().damping(20).mass(0.8)}
          style={[styles.sheet, { paddingBottom: Math.max(insets.bottom, 16) + 8 }]}
          accessibilityViewIsModal
        >
          <View style={styles.handle} />
          {title ? (
            <View style={styles.header}>
              <AppText variant="title" style={styles.title} numberOfLines={1} accessibilityRole="header">
                {title}
              </AppText>
              <IconButton icon="close" accessibilityLabel="Fermer" onPress={onClose} size="sm" />
            </View>
          ) : null}
          <ScrollView keyboardShouldPersistTaps="handled" bounces={false} showsVerticalScrollIndicator={false}>
            {children}
          </ScrollView>
        </Animated.View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const makeStyles = ({ colors, radius, spacing }: Theme) =>
  StyleSheet.create({
    root: { flex: 1, justifyContent: "flex-end" },
    backdrop: { flex: 1, backgroundColor: colors.overlay },
    sheet: {
      backgroundColor: colors.surface,
      borderTopLeftRadius: radius.xl + 4,
      borderTopRightRadius: radius.xl + 4,
      paddingHorizontal: spacing.xl,
      paddingTop: spacing.sm,
      maxHeight: "90%",
    },
    handle: {
      alignSelf: "center",
      width: 40,
      height: 4,
      borderRadius: 2,
      backgroundColor: colors.border,
      marginBottom: spacing.lg,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: spacing.xl,
      gap: spacing.md,
    },
    title: { flex: 1 },
  });
