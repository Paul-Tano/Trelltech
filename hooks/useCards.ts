import { useEffect, useState } from "react";
import {
  getCardsByList, createCard, updateCard,
  deleteCard, addMemberToCard,
} from "../services/cardService";
import { Card, CreateCardInput, UpdateCardInput } from "../types";

export function useCards(listId: string) {
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchCards = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getCardsByList(listId);
      setCards(data);
    } catch (e: any) {
      setError(e?.message || "Impossible de charger les cartes.");
    } finally {
      setLoading(false);
    }
  };

  const addCard = async (
    input: CreateCardInput,
    memberIds?: string[]
  ) => {
    try {
      setLoading(true);
      setError("");
      const newCard = await createCard(input);
      if (memberIds?.length) {
        await Promise.all(
          memberIds.map((memberId) => addMemberToCard(newCard.id, memberId))
        );
        await fetchCards();
      } else {
        setCards((prev) => [...prev, newCard]);
      }
    } catch (e: any) {
      setError(e?.message || "Impossible de créer la carte.");
    } finally {
      setLoading(false);
    }
  };

  const editCard = async (id: string, input: UpdateCardInput) => {
    try {
      setLoading(true);
      setError("");
      const updated = await updateCard(id, input);
      setCards((prev) => prev.map((c) => (c.id === id ? updated : c)));
    } catch (e: any) {
      setError(e?.message || "Impossible de modifier la carte.");
    } finally {
      setLoading(false);
    }
  };

  const removeCard = async (id: string) => {
    try {
      setLoading(true);
      setError("");
      await deleteCard(id);
      setCards((prev) => prev.filter((c) => c.id !== id));
    } catch (e: any) {
      setError(e?.message || "Impossible de supprimer la carte.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (listId) fetchCards();
  }, [listId]);

  return { cards, loading, error, refetch: fetchCards, addCard, editCard, removeCard };
}