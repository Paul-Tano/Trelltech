import { forwardRef, useState } from "react";
import { StyleSheet, TextInput, TextInputProps, View } from "react-native";
import { Theme } from "@/constants/theme";
import { useTheme, useThemedStyles } from "@/hooks/useTheme";
import AppText from "./AppText";

type Props = TextInputProps & {
  label: string;
  error?: string | null;
  hint?: string;
};

const TextField = forwardRef<TextInput, Props>(function TextField(
  { label, error, hint, multiline, style, onFocus, onBlur, ...props },
  ref,
) {
  const { colors } = useTheme();
  const styles = useThemedStyles(makeStyles);
  const [focused, setFocused] = useState(false);

  return (
    <View style={styles.container}>
      <AppText variant="caption" color="textMuted">
        {label}
      </AppText>
      <TextInput
        ref={ref}
        {...props}
        multiline={multiline}
        accessibilityLabel={label}
        placeholderTextColor={colors.textSubtle}
        selectionColor={colors.primary}
        onFocus={(e) => {
          setFocused(true);
          onFocus?.(e);
        }}
        onBlur={(e) => {
          setFocused(false);
          onBlur?.(e);
        }}
        style={[
          styles.input,
          multiline && styles.multiline,
          focused && styles.focused,
          !!error && styles.invalid,
          style,
        ]}
      />
      {error ? (
        <AppText variant="caption" color="danger" accessibilityLiveRegion="polite">
          {error}
        </AppText>
      ) : hint ? (
        <AppText variant="caption" color="textSubtle">
          {hint}
        </AppText>
      ) : null}
    </View>
  );
});

export default TextField;

const makeStyles = ({ colors, radius, spacing, typography }: Theme) =>
  StyleSheet.create({
    container: { gap: spacing.xs + 2 },
    input: {
      ...typography.body,
      color: colors.text,
      backgroundColor: colors.surfaceMuted,
      borderRadius: radius.md,
      borderWidth: 1.5,
      borderColor: "transparent",
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.md,
      minHeight: 48,
    },
    multiline: { minHeight: 104, textAlignVertical: "top", paddingTop: spacing.md },
    focused: { borderColor: colors.primary, backgroundColor: colors.surface },
    invalid: { borderColor: colors.danger },
  });
