
import React from "react";
import { Pressable, Text } from "react-native";

export default function Button({
  title,onPress,variant = "primary",
}: {
  title: string;
  onPress: () => void;
  variant?: "primary" | "danger" | "outline";
}) {
  const base = "px-4 py-3 rounded-xl items-center";
  const styles = {
    primary: "bg-blue-600",
    danger: "bg-red-600",
    outline: "border border-blue-600 bg-transparent",
  };

  const textStyles = {
    primary: "text-white",
    danger: "text-white",
    outline: "text-blue-600",
  };

  return (
    <Pressable onPress={onPress} className={`${base} ${styles[variant]}`}>
      <Text className={`font-bold ${textStyles[variant]}`}>{title}</Text>
    </Pressable>
  );
}