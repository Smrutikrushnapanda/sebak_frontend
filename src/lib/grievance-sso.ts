export type SsoAssertionPayload = {
  grievanceUserId: string;
  email: string;
  roleId: number;
  signature: string;
  expiresAt: string;
};

export const SSO_MESSAGE_TYPE = 'GRIEVANCE_SSO_ASSERTION';
export const SSO_LINK_RESULT_TYPE = 'GRIEVANCE_SSO_LINK_RESULT';
export const SSO_READY_TYPE = 'GRIEVANCE_SSO_READY';

export const getGrievanceSsoOrigin = (): string | null => {
  const ssoUrl = process.env.NEXT_PUBLIC_GRIEVANCE_SSO_URL;
  if (!ssoUrl) return null;
  try {
    return new URL(ssoUrl).origin;
  } catch {
    return null;
  }
};

/** Relative grievance app path only — reject absolute / protocol-relative URLs. */
export const isSafeRelativeGrievancePath = (value: unknown): value is string => {
  if (typeof value !== 'string' || !value.startsWith('/') || value.startsWith('//')) {
    return false;
  }
  if (value.includes('\\') || value.includes('://')) {
    return false;
  }
  try {
    const parsed = new URL(value, 'https://grievance.invalid');
    return parsed.origin === 'https://grievance.invalid';
  } catch {
    return false;
  }
};

export const isValidSsoAssertion = (value: unknown): value is SsoAssertionPayload => {
  if (!value || typeof value !== 'object') return false;
  const assertion = value as Record<string, unknown>;
  return (
    typeof assertion.grievanceUserId === 'string' &&
    assertion.grievanceUserId.length > 0 &&
    typeof assertion.email === 'string' &&
    assertion.email.length > 0 &&
    typeof assertion.roleId === 'number' &&
    Number.isFinite(assertion.roleId) &&
    typeof assertion.signature === 'string' &&
    assertion.signature.length > 0 &&
    typeof assertion.expiresAt === 'string' &&
    assertion.expiresAt.length > 0
  );
};

export const postSsoLinkResult = (
  source: MessageEventSource | null,
  targetOrigin: string,
  result: { ok: true } | { ok: false; error: string },
) => {
  if (!source || typeof (source as Window).postMessage !== 'function') return;
  (source as Window).postMessage(
    {
      type: SSO_LINK_RESULT_TYPE,
      ...result,
    },
    targetOrigin,
  );
};

export const openGrievanceSsoPopup = (path: string): Window | null => {
  const width = 500;
  const height = 600;
  const left = Math.round(window.screenX + (window.outerWidth - width) / 2);
  const top = Math.round(window.screenY + (window.outerHeight - height) / 2);
  const features = [
    `width=${width}`,
    `height=${height}`,
    `left=${left}`,
    `top=${top}`,
    'scrollbars=yes',
    'resizable=yes',
    'toolbar=no',
    'menubar=no',
    'location=yes',
    'status=no',
  ].join(',');

  const authWindow = window.open(path, 'grievance_sso', features);
  if (!authWindow) return null;
  authWindow.focus();
  return authWindow;
};
