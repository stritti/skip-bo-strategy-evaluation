/**
 * Privacy-friendly event tracking via Plausible (self-hosted, no cookies/PII).
 * No-ops during SSG/prerendering (no window).
 */

type EventProps = Record<string, string | number | boolean>;

export function trackEvent(name: string, props?: EventProps): void {
    if (typeof window === 'undefined') return;
    const plausible = (window as unknown as { plausible?: (...args: unknown[]) => void }).plausible;
    if (typeof plausible === 'function') {
        if (props) plausible(name, { props });
        else plausible(name);
    }
}
