# BlinkMoney

A React Native app for a small-ticket investing product. The part being worked on right now is Rewards, which is the gifting loop: you send someone a small investment as a gift, they open it, claim it, and watch it grow.

Expo SDK 54, expo-router, TypeScript. Dark only, portrait only. Android is the target and is where it has been tested.

**The home screen is deliberately blank.** It renders the header and the bottom nav and nothing else. The promo carousel, Start SIP button, SIP calculator and quick actions were taken off it. Those components are still in `components/home/`, untouched, so putting any of them back is an import and a line of JSX in `app/(tabs)/index.tsx`.

## Setup

```bash
npm install
npx expo start
```

Press `a` for Android, `i` for iOS, or scan the QR code with Expo Go. Your phone and computer need to be on the same network. If the QR code will not connect, use `npx expo start --tunnel`, which is slower but works across networks.

If an edit does not show up on the device, it is usually a stale Metro cache. Stop the server and run `npx expo start --clear`. Changes to `app.json` need a full restart, not just a reload.

Other commands: `npm run lint`, and `npx tsc --noEmit` to type check. There are no tests.

## Where things are

```
app/
  (tabs)/index.tsx     Home. Header and nav bar only.
  rewards.tsx          The live screen. Two doors: send a gift, or open yours.
  gift-send/           Send flow: card, details, preview, sent.
  gift-received.tsx    The gifts you have been sent.
  gift-reveal.tsx      Opening one.
  gift-growing.tsx     What it grew into.
components/
  rewards/             Option cards for the rewards screen.
  gift-send/           Card picker, confetti, flow footer, card artwork.
  gift-seed/           Reveal card, investment chart, radial pool.
  envelope/            The animated envelope used in the reveal.
  ui/                  Shared buttons, headers, skeletons, state messages.
  home/                Header and bottom nav, plus the parked home sections.
constants/             Design tokens, gift card designs, received gifts.
providers/             Theme context, gift draft context.
lib/sip.ts             Projection maths and rupee formatting.
```

Routing is expo-router with one `Stack` at the root. Every screen is headerless and draws its own top bar. The tab bar is hidden and the visible nav is `components/home/bottom-nav.tsx`, a normal component each screen renders itself.

The gift being composed lives in `providers/gift-draft-provider.tsx`, mounted by `app/gift-send/_layout.tsx` rather than at the root. The draft is created when the flow opens and thrown away when it closes, so starting a second gift begins empty instead of inheriting the last one.

## Edge cases

Not many, but these are the ones the gifting flow actually hits:

**Non-numeric amounts.** The custom amount field is free text. The draft provider guards with `Number.isFinite` and falls back to 0, so `NaN` never reaches the preview or the sent screen. Amounts clamp to `MIN_GIFT` (₹21) and `MAX_GIFT` (₹25,000) from `constants/gift-cards.ts`.

**A gift id that does not resolve.** `findReceivedGift` returns `undefined` for an unknown or missing id, and the reveal screen renders a "Gift not found" state with a route back to the gift list instead of crashing. Separately, `cardForGift` falls back to the first design if a gift points at a card id that no longer exists, so removing a design from `GIFT_CARDS` does not break older gifts.

**Rupee formatting.** `formatRupees` uses `Intl.NumberFormat('en-IN')` for Indian grouping (₹1,23,456 rather than ₹123,456). Some Android Hermes builds ship a trimmed ICU where that throws, so there is a manual lakh and crore fallback in a `catch`. Keep it if you change the formatting.

**Keyboard and message length.** The details screen wraps its content in `KeyboardAvoidingView` so the message field is not covered, and the message is capped at 140 characters.

**Reduce Motion.** The reveal animations and press feedback check `useReducedMotion` and fall back to no movement. Worth checking whenever you add animation to these screens.

**Missing provider.** `useTheme` and `useGiftDraft` throw rather than falling back. A silent default renders a screen in the wrong colours or with an empty draft and no error, which is harder to find than a crash on first run.

## Not wired up

* No backend. Gift cards and received gifts are local constants, so nothing persists and a reload resets everything, including gifts you have "sent".
* No auth, no real money movement. The user is hardcoded as "User".
* Web runs but is not maintained. The layouts are built for phones.

## Conventions

* Import colour, spacing, radii and type from `constants/theme.ts`. No hardcoded hex values or one-off gaps.
* Styling is `StyleSheet` plus those tokens. NativeWind is installed only because the envelope animation still needs it.
* Gradients come from `react-native-svg`, not `expo-linear-gradient`, so nothing here needs a native module that Expo Go does not already ship.
* `SafeAreaView` always from `react-native-safe-area-context`. React Native's own is a no-op on Android and would put headers under the status bar.
* Expo SDK 54 changed enough that older answers are often wrong. Check https://docs.expo.dev/versions/v54.0.0/ rather than a general search result.
