import { browser } from '$app/environment';

type Theme = 'light' | 'dark';

function createThemeStore() {
    let theme = $state<Theme>('light');

    // Initialize theme from localStorage or system preference
    if (browser) {
        // Prevent transition flash on page load
        document.documentElement.classList.add('preload');

        const stored = localStorage.getItem('theme') as Theme | null;
        if (stored && (stored === 'light' || stored === 'dark')) {
            theme = stored;
        } else {
            theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        }
        applyTheme(theme);

        // Remove preload class after a short delay
        setTimeout(() => {
            document.documentElement.classList.remove('preload');
        }, 100);
    }

    function applyTheme(newTheme: Theme) {
        if (!browser) return;

        const root = document.documentElement;

        // Ensure transition is enabled before theme change
        root.style.transition = 'color-scheme 0.3s ease';

        if (newTheme === 'dark') {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }
        localStorage.setItem('theme', newTheme);

        // Clean up transition after theme change completes
        setTimeout(() => {
            root.style.transition = '';
        }, 300);
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