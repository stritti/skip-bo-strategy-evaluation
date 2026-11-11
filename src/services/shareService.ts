/**
 * Secure sharing of local runs: POSTs the run export to the Netlify function
 * /.netlify/functions/share-run, which validates it and opens a pull request.
 * The share token is only kept in localStorage and sent as a Bearer token.
 */
import type { GameResult } from '../game/types';

export interface ShareResult {
    file: string;
    branch: string;
    prUrl: string;
}

export class ShareError extends Error {
    readonly status: number;
    constructor(message: string, status: number) {
        super(message);
        this.name = 'ShareError';
        this.status = status;
    }
}

const TOKEN_KEY = 'skipbo_share_token';

export function getShareToken(): string {
    try {
        return localStorage.getItem(TOKEN_KEY) ?? '';
    } catch {
        return '';
    }
}

export function saveShareToken(token: string): void {
    try {
        localStorage.setItem(TOKEN_KEY, token);
    } catch {
        // storage unavailable (private mode) — token just won't persist
    }
}

export function buildSharePayload(data: GameResult[], strategyP1: string, strategyP2: string, seed: number | null): unknown {
    return {
        version: 1,
        metadata: {
            exportDate: new Date().toISOString(),
            totalGames: data.length,
            strategyP1,
            strategyP2,
            seed
        },
        results: data
    };
}

export async function shareRun(payload: unknown, token: string): Promise<ShareResult> {
    const res = await fetch('/.netlify/functions/share-run', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
    });
    const data = (await res.json().catch(() => ({}))) as Partial<ShareResult> & { error?: string };
    if (!res.ok) throw new ShareError(data.error ?? `HTTP ${res.status}`, res.status);
    return data as ShareResult;
}
