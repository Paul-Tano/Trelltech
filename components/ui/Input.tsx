import React from "react";
import { Text, View, TextInput } from "react-native";

type InputProps = {
  label?: string; error?: string;
  secure?: boolean;multiline?: boolean;
} & React.ComponentProps<typeof TextInput>;

export function Input({ label, error, secure = false, multiline = false, ...props }: InputProps) {
  return (
    <View className="gap-1">
      {label ? <Text className="text-gray-700 font-semibold">{label}</Text> : null}

      <TextInput
        {...props}
        secureTextEntry={secure}
        multiline={multiline}
        className="border border-gray-300 rounded-xl px-4 py-3 bg-white text-gray-900"
        placeholderTextColor="#94a3b8"
        style={multiline ? { minHeight: 100, textAlignVertical: "top" } : undefined}
      />

      {error ? <Text className="text-red-600 text-sm">{error}</Text> : null}
    </View>
  );
}