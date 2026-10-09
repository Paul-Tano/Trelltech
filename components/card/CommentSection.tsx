import { useState } from "react";
import { StyleSheet, TextInput, View } from "react-native";
import { Theme } from "@/constants/theme";
import { useTheme, useThemedStyles } from "@/hooks/useTheme";
import { useComments } from "@/hooks/useComments";
import { useMe } from "@/hooks/useMe";
import { confirm } from "@/utils/confirm";
import { formatRelative } from "@/utils/date";
import AppText from "@/components/ui/AppText";
import Avatar from "@/components/ui/Avatar";
import IconButton from "@/components/ui/IconButton";
import { Skeleton } from "@/components/ui/States";
import Section from "./Section";

type Props = { cardId: string };

/** Fil de commentaires : rédaction en haut, messages du plus récent au plus ancien. */
export default function CommentSection({ cardId }: Props) {
  const { colors } = useTheme();
  const styles = useThemedStyles(makeStyles);
  const { me } = useMe();
  const { comments, status, post, remove } = useComments(cardId);
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);

  const send = async () => {
    if (!draft.trim()) return;
    setSending(true);
    const ok = await post(draft.trim());
    setSending(false);
    if (ok) setDraft("");
  };

  const askRemove = async (commentId: string) => {
    const ok = await confirm({
      title: "Supprimer le commentaire ?",
      message: "Il sera supprimé pour tous les membres du board.",
      confirmLabel: "Supprimer",
    });
    if (ok) await remove(commentId);
  };

  return (
    <Section icon="chatbubbles-outline" title={`Commentaires${comments.length ? ` · ${comments.length}` : ""}`}>
      <View style={styles.composer}>
        <Avatar member={me} size={32} />
        <TextInput
          value={draft}
          onChangeText={setDraft}
          placeholder="Écrire un commentaire…"
          placeholderTextColor={colors.textSubtle}
          selectionColor={colors.primary}
          multiline
          accessibilityLabel="Écrire un commentaire"
          style={styles.input}
          maxLength={16384}
        />
        <IconButton
          icon="send"
          variant="primary"
          size="sm"
          accessibilityLabel="Publier le commentaire"
          onPress={send}
          disabled={!draft.trim() || sending}
        />
      </View>

      {status === "loading" ? (
        <Skeleton height={56} />
      ) : comments.length === 0 ? (
        <AppText variant="caption" color="textSubtle">
          Aucun commentaire pour l&apos;instant.
        </AppText>
      ) : (
        comments.map((comment) => (
          <View key={comment.id} style={styles.comment}>
            <Avatar member={comment.memberCreator} size={32} />
            <View style={styles.body}>
              <View style={styles.meta}>
                <AppText variant="caption" style={styles.author} numberOfLines={1}>
                  {comment.memberCreator.fullName || comment.memberCreator.username}
                </AppText>
                <AppText variant="caption" color="textSubtle">
                  {formatRelative(comment.date)}
                </AppText>
              </View>
              <View style={styles.bubble}>
                <AppText>{comment.data.text}</AppText>
              </View>
            </View>
            {me && comment.memberCreator.id === me.id ? (
              <IconButton
                icon="trash-outline"
                size="sm"
                variant="ghost"
                accessibilityLabel="Supprimer mon commentaire"
                onPress={() => askRemove(comment.id)}
              />
            ) : null}
          </View>
        ))
      )}
    </Section>
  );
}

const makeStyles = ({ colors, radius, spacing, typography }: Theme) =>
  StyleSheet.create({
    composer: { flexDirection: "row", alignItems: "flex-end", gap: spacing.sm },
    input: {
      ...typography.body,
      flex: 1,
      color: colors.text,
      backgroundColor: colors.surfaceMuted,
      borderRadius: radius.md,
      paddingHorizontal: spacing.md,
      paddingTop: 11,
      paddingBottom: 11,
      minHeight: 44,
      maxHeight: 140,
    },
    comment: { flexDirection: "row", alignItems: "flex-start", gap: spacing.sm },
    body: { flex: 1, gap: spacing.xs },
    meta: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
    author: { fontWeight: "700", color: colors.text, flexShrink: 1 },
    bubble: {
      backgroundColor: colors.surfaceMuted,
      borderRadius: radius.md,
      borderTopLeftRadius: 4,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
    },
  });
