import { useCallback, useState } from "react";
import { Member } from "@/types";
import { searchMembers as searchMembersService } from "@/services/memberService";

export function useMembers() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const searchMembers = useCallback(async (query: string) => {
    try {
      setLoading(true);
      setError("");
      const data = await searchMembersService(query);
      setMembers(data);
      return data;
    } catch (e: any) {
      setError(e?.message || "Recherche de membres échouée.");
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  return { members, loading, error, searchMembers };
}