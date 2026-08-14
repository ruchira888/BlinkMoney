/**
 * The gift being composed, shared across the four steps of the send flow.
 *
 * A context rather than router params: the message is free text that would
 * have to be URL-encoded through three navigations, and a half-built draft
 * belongs to the flow, not to any one screen's address.
 *
 * Mounted by app/gift-send/_layout.tsx, so the draft is created when the flow
 * opens and discarded when it closes -- which is what makes starting a second
 * gift begin empty instead of inheriting the last one.
 *
 * Rule 5: holds plain state, no navigation hooks, so it is safe above <Stack>.
 */

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';

import {
  DEFAULT_CARD_ID,
  GIFT_CARDS,
  type GiftCardDesign,
} from '@/constants/gift-cards';

type GiftDraft = {
  cardId: string;
  amount: number;
  message: string;
};

type GiftDraftContextValue = GiftDraft & {
  /** The resolved design, so screens never re-look-up the id themselves. */
  card: GiftCardDesign;
  setCardId: (id: string) => void;
  setAmount: (amount: number) => void;
  setMessage: (message: string) => void;
};

const GiftDraftContext = createContext<GiftDraftContextValue | null>(null);

const INITIAL_AMOUNT = 101;

export function GiftDraftProvider({ children }: { children: ReactNode }) {
  const [cardId, setCardId] = useState(DEFAULT_CARD_ID);
  const [amount, setAmount] = useState(INITIAL_AMOUNT);
  const [message, setMessage] = useState('');

  const card = useMemo(
    () => GIFT_CARDS.find((item) => item.id === cardId) ?? GIFT_CARDS[0],
    [cardId]
  );

  const handleSetAmount = useCallback((next: number) => {
    // Guard the preview and the sent screen against NaN arriving from the
    // custom-amount field.
    setAmount(Number.isFinite(next) ? Math.round(next) : 0);
  }, []);

  const value = useMemo<GiftDraftContextValue>(
    () => ({
      cardId,
      amount,
      message,
      card,
      setCardId,
      setAmount: handleSetAmount,
      setMessage,
    }),
    [amount, card, cardId, handleSetAmount, message]
  );

  return <GiftDraftContext.Provider value={value}>{children}</GiftDraftContext.Provider>;
}

export function useGiftDraft(): GiftDraftContextValue {
  const value = useContext(GiftDraftContext);
  if (!value) {
    throw new Error('useGiftDraft must be used inside <GiftDraftProvider>.');
  }
  return value;
}
