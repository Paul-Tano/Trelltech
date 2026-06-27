
import React from "react";
import { View, Text } from "react-native";

export default function EmptyState({
  title,subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <View className="items-center justify-center py-10 px-4">
      <Text className="text-4xl text-gray-400">○</Text>
      <Text className="text-lg font-bold text-gray-900 mt-3 text-center">{title}</Text>
      {subtitle ? <Text className="text-gray-500 mt-1 text-center">{subtitle}</Text> : null}
    </View>
  );
}