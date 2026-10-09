import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { spacing } from "@/constants/theme";
import Button from "./Button";
import TextField from "./TextField";

export type EntityFormValues = { name: string; desc: string };

type Props = {
  nameLabel: string;
  namePlaceholder: string;
  /** Affiche le champ description (workspaces, boards, cartes). */
  withDescription?: boolean;
  initialValues?: Partial<EntityFormValues>;
  submitLabel: string;
  /** Renvoie `true` si l'opération a réussi : le formulaire n'est vidé qu'à ce moment-là. */
  onSubmit: (values: EntityFormValues) => Promise<boolean>;
  onCancel: () => void;
};

/**
 * Formulaire « nom + description » partagé par les workspaces, boards, listes et cartes.
 * Les champs sont conservés en cas d'échec pour que l'utilisateur ne perde pas sa saisie.
 */
export default function EntityForm({
  nameLabel,
  namePlaceholder,
  withDescription = false,
  initialValues,
  submitLabel,
  onSubmit,
  onCancel,
}: Props) {
  const [name, setName] = useState(initialValues?.name ?? "");
  const [desc, setDesc] = useState(initialValues?.desc ?? "");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const submit = async () => {
    if (!name.trim()) {
      setError("Ce champ est obligatoire.");
      return;
    }
    setError(null);
    setSubmitting(true);
    const ok = await onSubmit({ name: name.trim(), desc: desc.trim() });
    setSubmitting(false);
    if (ok) {
      setName("");
      setDesc("");
    }
  };

  return (
    <View style={styles.form}>
      <TextField
        label={nameLabel}
        placeholder={namePlaceholder}
        value={name}
        onChangeText={(value) => {
          setName(value);
          if (error) setError(null);
        }}
        error={error}
        autoFocus
        returnKeyType={withDescription ? "next" : "done"}
        onSubmitEditing={withDescription ? undefined : submit}
        maxLength={256}
      />
      {withDescription ? (
        <TextField
          label="Description"
          hint="Facultatif"
          placeholder="De quoi s'agit-il ?"
          value={desc}
          onChangeText={setDesc}
          multiline
        />
      ) : null}
      <View style={styles.buttons}>
        <Button label="Annuler" variant="ghost" onPress={onCancel} style={styles.button} />
        <Button label={submitLabel} onPress={submit} loading={submitting} style={styles.button} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  form: { gap: spacing.lg },
  buttons: { flexDirection: "row", gap: spacing.md, marginTop: spacing.xs },
  button: { flex: 1 },
});
