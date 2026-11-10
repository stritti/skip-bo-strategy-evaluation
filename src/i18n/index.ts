import { createI18n, useI18n } from 'vue-i18n';
import { de, en } from './messages';

export type AppLocale = 'de' | 'en';

export const LOCALE_STORAGE_KEY = 'skipbo-locale';

export function createAppI18n(initialLocale: AppLocale = 'de') {
    return createI18n({
        legacy: false,
        locale: initialLocale,
        fallbackLocale: 'de',
        messages: { de, en }
    });
}

export function isEnPath(path: string): boolean {
    return path === '/en' || path.startsWith('/en/');
}

const strategyKeyMap: Record<string, 'opt' | 'rnd' | 'spo' | 'adv'> = {
    Optimiert: 'opt',
    Zufall: 'rnd',
    Spontan: 'spo',
    Fortgeschritten: 'adv'
};

export function useStrategyLabel() {
    const { t } = useI18n({ useScope: 'global' });
    return (s: string) => t(`strategy.names.${strategyKeyMap[s] ?? 'opt'}`);
}
