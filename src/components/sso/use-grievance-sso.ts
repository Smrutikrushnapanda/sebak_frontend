'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { ApiClient } from '@/lib/api-client';
import {
  getGrievanceSsoOrigin,
  isSafeRelativeGrievancePath,
  isValidSsoAssertion,
  openGrievanceSsoPopup,
  postSsoLinkResult,
  SSO_MESSAGE_TYPE,
  SSO_READY_TYPE,
} from '@/lib/grievance-sso';

/**
 * Sebak ↔ Grievance SSO:
 * - Mapped: card loader + main-window ticket navigate (no popup)
 * - Unmapped: popup for first-time password/map + postMessage handoff
 */
export function useGrievanceSso() {
  const grievancePopupRef = useRef<Window | null>(null);
  const ssoLinkInFlight = useRef(false);
  const ssoReadyInFlight = useRef(false);
  const openInFlight = useRef(false);
  const linkedCacheRef = useRef<boolean | null>(null);
  const [isOpeningGrievance, setIsOpeningGrievance] = useState(false);

  const openGrievanceWindow = useCallback((path: string) => {
    const authWindow = openGrievanceSsoPopup(path);
    if (!authWindow) {
      toast.error('Popup blocked. Allow popups for this site to open Grievance.');
      return null;
    }
    grievancePopupRef.current = authWindow;
    return authWindow;
  }, []);

  // Prefetch link status so unmapped clicks can open the popup sooner.
  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const status = await ApiClient.get<{ linked?: boolean }>('sso-auth/me');
        if (!cancelled) linkedCacheRef.current = Boolean(status?.linked);
      } catch {
        // Leave cache null — click path will re-fetch.
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const openGrievanceAuthWindow = useCallback(async () => {
    if (openInFlight.current) return;

    const ssoOrigin = getGrievanceSsoOrigin();
    if (!ssoOrigin) {
      toast.error('Grievance SSO URL is not configured');
      return;
    }

    openInFlight.current = true;

    // Known-unmapped: open the map popup immediately (gesture-safe). SSO page handles loading UI.
    if (linkedCacheRef.current === false) {
      const opened = openGrievanceWindow(`${ssoOrigin}/auth/sso`);
      if (opened) {
        toast.message('Complete sign-in in the Grievance window to link your account.');
      }
      openInFlight.current = false;
      return;
    }

    setIsOpeningGrievance(true);

    try {
      let linked = linkedCacheRef.current;
      if (linked === null) {
        const status = await ApiClient.get<{ linked?: boolean }>('sso-auth/me');
        linked = Boolean(status?.linked);
        linkedCacheRef.current = linked;
      }

      // Mapped: mint ticket and navigate this tab — no popup.
      if (linked) {
        toast.message('Signing you into Grievance…');
        const ticketRes = await ApiClient.post<{ ticket?: string }>('sso-auth/session-ticket');
        if (!ticketRes?.ticket) {
          throw new Error('Failed to create grievance SSO session ticket');
        }
        window.location.assign(
          `${ssoOrigin}/sso/continue?ticket=${encodeURIComponent(ticketRes.ticket)}`,
        );
        return;
      }

      // Unmapped (discovered on click): open map popup; SSO page shows its own loader.
      const opened = openGrievanceWindow(`${ssoOrigin}/auth/sso`);
      if (opened) {
        toast.message('Complete sign-in in the Grievance window to link your account.');
      }
      openInFlight.current = false;
      setIsOpeningGrievance(false);
    } catch (error) {
      openInFlight.current = false;
      setIsOpeningGrievance(false);
      toast.error(
        error instanceof Error
          ? error.message
          : 'Could not start Grievance SSO login',
      );
    }
  }, [openGrievanceWindow]);

  useEffect(() => {
    const expectedOrigin = getGrievanceSsoOrigin();
    if (!expectedOrigin) return;

    const onMessage = async (event: MessageEvent) => {
      if (event.origin !== expectedOrigin) return;
      if (!event.data || typeof event.data !== 'object') return;

      // Popup finished verification — log this Sebak window into grievance via a fresh ticket.
      if (event.data.type === SSO_READY_TYPE) {
        const path = event.data.path;
        if (!isSafeRelativeGrievancePath(path)) {
          toast.error('Invalid Grievance redirect path');
          return;
        }
        if (ssoReadyInFlight.current) return;
        ssoReadyInFlight.current = true;
        linkedCacheRef.current = true;
        setIsOpeningGrievance(true);

        try {
          if (grievancePopupRef.current && !grievancePopupRef.current.closed) {
            grievancePopupRef.current.close();
          }
        } catch {
          // Popup may already be closing itself.
        }
        grievancePopupRef.current = null;

        void (async () => {
          try {
            toast.message('Signing you into Grievance…');
            // Mint a fresh ticket so the surviving Sebak window gets the grievance session
            // (popup cookie/localStorage do not apply to this window).
            const ticketRes = await ApiClient.post<{ ticket?: string }>('sso-auth/session-ticket');
            if (!ticketRes?.ticket) {
              throw new Error('Failed to create grievance SSO session ticket');
            }
            const next = encodeURIComponent(path);
            window.location.assign(
              `${expectedOrigin}/sso/continue?ticket=${encodeURIComponent(ticketRes.ticket)}&next=${next}`,
            );
          } catch (error) {
            ssoReadyInFlight.current = false;
            setIsOpeningGrievance(false);
            toast.error(
              error instanceof Error
                ? error.message
                : 'Could not sign you into Grievance',
            );
          }
        })();
        return;
      }

      if (event.data.type !== SSO_MESSAGE_TYPE) return;

      const assertion = event.data.assertion;
      if (!isValidSsoAssertion(assertion)) {
        postSsoLinkResult(event.source, event.origin, {
          ok: false,
          error: 'Invalid SSO assertion payload',
        });
        toast.error('Invalid SSO assertion from Grievance');
        return;
      }

      if (ssoLinkInFlight.current) return;
      ssoLinkInFlight.current = true;

      try {
        await ApiClient.post('sso-auth/link', assertion);
        linkedCacheRef.current = true;
        // Ack so the popup can post READY and close.
        postSsoLinkResult(event.source, event.origin, { ok: true });
        toast.message('Grievance account linked. Opening dashboard…');
      } catch (error) {
        const message =
          error instanceof Error ? error.message : 'Failed to link Grievance account';
        postSsoLinkResult(event.source, event.origin, { ok: false, error: message });
        toast.error(message);
      } finally {
        ssoLinkInFlight.current = false;
      }
    };

    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, []);

  return { openGrievanceAuthWindow, isOpeningGrievance };
}
