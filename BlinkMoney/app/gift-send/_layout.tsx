/**
 * The Gift a Seed send flow: pick a card, add details, preview, send.
 *
 * Exactly one navigator at this level, and GiftDraftProvider sits above it so
 * the draft survives navigation between the four steps. The provider holds
 * plain state and no navigation hooks, so it is safe there (rule 5).
 *
 * Mounting the provider here rather than at the root is deliberate: the draft
 * is created when the flow opens and thrown away when it closes, so starting a
 * second gift begins empty.
 */

import { Stack } from 'expo-router';

import { GiftDraftProvider } from '@/providers/gift-draft-provider';

export default function GiftSendLayout() {
  return (
    <GiftDraftProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </GiftDraftProvider>
  );
}
