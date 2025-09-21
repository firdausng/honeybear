import { browser } from '$app/environment';

type Theme = 'light' | 'dark';

function createThemeStore() {
    let theme = $state<Theme>('light');

    // Initialize theme from localStorage or system preference
    if (browser) {
        const stored = localStorage.getItem('theme') as Theme | null;
        if (stored && (stored === 'light' || stored === 'dark')) {
            theme = stored;
        } else {
            theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        }
        applyTheme(theme);
    }

    function applyTheme(newTheme: Theme) {
        if (!browser) return;

        const root = document.documentElement;
        if (newTheme === 'dark') {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }
        localStorage.setItem('theme', newTheme);
    }

    function setTheme(newTheme: Theme) {
        theme = newTheme;
        applyTheme(newTheme);
    }

    function toggleTheme() {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
    }

    return {
        get current() {
            return theme;
        },
        setTheme,
        toggleTheme
    };
}

export const themeStore = createThemeStore();