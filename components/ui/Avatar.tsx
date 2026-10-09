import { StyleSheet, View } from "react-native";
import { Image } from "expo-image";
import { Member } from "@/types";
import { useTheme } from "@/hooks/useTheme";
import { accentFor, initials } from "@/utils/color";
import AppText from "./AppText";

type Props = {
  member?: Pick<Member, "id" | "fullName" | "username" | "avatarUrl"> | null;
  size?: number;
  /** Anneau autour de l'avatar (utile dans les piles qui se chevauchent). */
  ring?: boolean;
};

/** L'URL d'avatar Trello est une base : il faut y ajouter la taille voulue. */
function avatarUri(url: string, size: number) {
  return `${url}/${size > 50 ? 170 : 50}.png`;
}

export default function Avatar({ member, size = 36, ring }: Props) {
  const { colors } = useTheme();
  const name = member?.fullName || member?.username || "";
  const frame = {
    width: size,
    height: size,
    borderRadius: size / 2,
    borderWidth: ring ? 2 : 0,
    borderColor: colors.surface,
  };

  if (member?.avatarUrl) {
    return (
      <Image
        source={{ uri: avatarUri(member.avatarUrl, size) }}
        style={frame}
        accessibilityLabel={name}
        transition={150}
      />
    );
  }

  return (
    <View
      style={[styles.fallback, frame, { backgroundColor: accentFor(member?.id ?? name) }]}
      accessibilityLabel={name || undefined}
    >
      <AppText style={[styles.letters, { fontSize: size * 0.38, lineHeight: size * 0.46 }]}>{initials(name)}</AppText>
    </View>
  );
}

type StackProps = { members: Props["member"][]; max?: number; size?: number };

/** Avatars superposés : « +N » au-delà de `max`. */
export function AvatarStack({ members, max = 3, size = 24 }: StackProps) {
  const { colors } = useTheme();
  const visible = members.slice(0, max);
  const rest = members.length - visible.length;

  return (
    <View style={styles.stack} accessibilityLabel={`${members.length} membre${members.length > 1 ? "s" : ""}`}>
      {visible.map((member, index) => (
        <View key={member?.id ?? index} style={{ marginLeft: index === 0 ? 0 : -size / 3 }}>
          <Avatar member={member} size={size} ring />
        </View>
      ))}
      {rest > 0 ? (
        <View
          style={[
            styles.fallback,
            styles.more,
            { width: size, height: size, borderRadius: size / 2, marginLeft: -size / 3 },
            { backgroundColor: colors.surfaceMuted, borderColor: colors.surface },
          ]}
        >
          <AppText variant="micro" color="textMuted">
            +{rest}
          </AppText>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  fallback: { alignItems: "center", justifyContent: "center" },
  letters: { color: "#FFFFFF", fontWeight: "700" },
  stack: { flexDirection: "row", alignItems: "center" },
  more: { borderWidth: 2 },
});
