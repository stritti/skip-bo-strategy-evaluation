
import { ref } from 'vue';

export type Theme = 'light' | 'dark' | 'auto';

const theme = ref<Theme>('auto');

export function useTheme() {

    // Apply theme to HTML element
    const applyTheme = () => {
        const root = document.documentElement;
        const isDark = theme.value === 'dark' ||
            (theme.value === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches);

        if (isDark) {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }
    };

    const setTheme = (newTheme: Theme) => {
        theme.value = newTheme;
        localStorage.setItem('skipbo-theme', newTheme);
        applyTheme();
    };

    const initTheme = () => {
        const stored = localStorage.getItem('skipbo-theme') as Theme | null;
        if (stored) {
            theme.value = stored;
        }
        applyTheme();

        // Listen for system changes if auto
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
            if (theme.value === 'auto') {
                applyTheme();
            }
        });
    };

    return {
        theme,
        setTheme,
        initTheme
    };
}
