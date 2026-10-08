import { getMe } from "@/services/memberService";
import { useResource } from "./useResource";

export function useMe() {
  const { data, status, refresh, refreshing } = useResource(getMe, "Impossible de charger votre profil.");
  return { me: data, status, refresh, refreshing };
}
