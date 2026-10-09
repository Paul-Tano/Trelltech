import { StyleSheet, View } from "react-native";

type Props = { size?: number };

/** Logo TrellTech : trois colonnes de kanban sur fond violet (même dessin que l'icône de l'app). */
export default function BrandMark({ size = 88 }: Props) {
  const unit = size / 88;
  const columns = [40, 26, 33];

  return (
    <View
      style={[styles.tile, { width: size, height: size, borderRadius: 26 * unit, padding: 18 * unit, gap: 7 * unit }]}
      accessibilityLabel="Logo TrellTech"
      accessibilityRole="image"
    >
      {columns.map((height, index) => (
        <View
          key={index}
          style={{
            flex: 1,
            height: height * unit,
            borderRadius: 5 * unit,
            backgroundColor: index === 0 ? "#FFFFFF" : "rgba(255,255,255,0.75)",
          }}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  tile: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#5B3DF5",
    shadowColor: "#5B3DF5",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.35,
    shadowRadius: 20,
    elevation: 8,
  },
});
