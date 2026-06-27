
import React from "react";
import { Modal as RNModal, View, Text } from "react-native";
import Button from "./Button";

export default function Modal({
  visible,title,children,
  mode = "form",
  onCancel,onConfirm,
}: {
  visible: boolean;
  title?: string;
  children?: React.ReactNode;
  mode?: "confirm" | "form";
  onCancel: () => void;
  onConfirm?: () => void;
}) {
  return (
    <RNModal visible={visible} transparent  onRequestClose={onCancel}>
      <View className="flex-1 bg-black/50 justify-center px-5">
        <View className="bg-white rounded-2xl p-4 gap-3">
          {title ? <Text className="text-lg font-bold text-gray-900">{title}</Text> : null}
          {children}
          {mode === "confirm" ? (
            <View className="flex-row gap-3 mt-2">
              <View className="flex-1">
                <Button title="Annuler" variant="outline" onPress={onCancel} />
              </View>
              <View className="flex-1">
                <Button title="confirmer" variant="danger" onPress={onConfirm ?? onCancel} />
              </View>
            </View>
          ) : null}
        </View>
      </View>
    </RNModal>
  );
}