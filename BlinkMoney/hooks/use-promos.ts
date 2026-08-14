/**
 * Loads the promo carousel's content.
 *
 * Rule 10: the carousel is data-driven, so it has to model loading, empty,
 * error-with-retry and success as distinct states rather than "data or not".
 * This hook returns a discriminated union so the screen cannot render a state
 * it has not handled -- TypeScript rejects a switch that misses a case.
 *
 * The fetch is simulated against the local PROMOS constant. There is no
 * endpoint yet, and rule 7 rules out pointing it at localhost; when a real one
 * exists only `load` below changes, not a single consumer.
 */

import { useCallback, useEffect, useRef, useState } from 'react';

import { PROMOS, type Promo } from '@/constants/promos';

export type PromoState =
  | { status: 'loading' }
  | { status: 'empty' }
  | { status: 'error'; message: string }
  | { status: 'success'; promos: Promo[] };

/** Latency the simulated fetch pretends to have, in ms. Long enough that the
 *  skeleton is actually seen on a fast device rather than flashing. */
const FAKE_LATENCY = 900;

export function usePromos() {
  const [state, setState] = useState<PromoState>({ status: 'loading' });

  /**
   * Guards against setting state after unmount, and against a slow first
   * request landing on top of a newer one started by Retry.
   */
  const requestId = useRef(0);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  const load = useCallback(() => {
    const id = ++requestId.current;
    setState({ status: 'loading' });

    const timer = setTimeout(() => {
      if (!mounted.current || id !== requestId.current) {
        return;
      }
      try {
        const promos = PROMOS;
        setState(promos.length === 0 ? { status: 'empty' } : { status: 'success', promos });
      } catch (error) {
        setState({
          status: 'error',
          message: error instanceof Error ? error.message : 'Something went wrong.',
        });
      }
    }, FAKE_LATENCY);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const cancel = load();
    return cancel;
  }, [load]);

  return { state, retry: load } as const;
}
