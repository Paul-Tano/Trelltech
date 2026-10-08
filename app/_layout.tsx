import { Stack } from "expo-router";
import { ToastProvider } from "@/components/ui/Toast";
import { useTheme } from "@/hooks/useTheme";

export default function RootLayout() {
  const { colors } = useTheme();

  return (
    <ToastProvider>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background },
          animation: "slide_from_right",
        }}
      >
        <Stack.Screen name="index" options={{ animation: "none" }} />
        <Stack.Screen name="onboarding/token" options={{ animation: "fade", gestureEnabled: false }} />
        <Stack.Screen name="workspaces/index" options={{ animation: "fade" }} />
      </Stack>
    </ToastProvider>
  );
}
