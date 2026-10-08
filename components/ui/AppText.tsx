import { Text, TextProps } from "react-native";
import { ThemeColors, typography } from "@/constants/theme";
import { useTheme } from "@/hooks/useTheme";

type Props = TextProps & {
  variant?: keyof typeof typography;
  color?: keyof ThemeColors;
  align?: "left" | "center" | "right";
};

/** Texte typographié et coloré selon le thème courant. */
export default function AppText({ variant = "body", color = "text", align, style, ...props }: Props) {
  const theme = useTheme();
  return (
    <Text
      {...props}
      style={[typography[variant], { color: theme.colors[color] }, align ? { textAlign: align } : null, style]}
    />
  );
}
