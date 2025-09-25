import { browser } from '$app/environment';

class StickyModeStore {
    #isSticky = $state(true);

    constructor() {
        if (browser) {
            // Load from localStorage
            const stored = localStorage.getItem('sticky-mode-enabled');
            this.#isSticky = stored ? JSON.parse(stored) : true;
        }
    }

    get isSticky() {
        return this.#isSticky;
    }

    toggle() {
        this.#isSticky = !this.#isSticky;
        if (browser) {
            localStorage.setItem('sticky-mode-enabled', JSON.stringify(this.#isSticky));
        }
    }

    enable() {
        this.#isSticky = true;
        if (browser) {
            localStorage.setItem('sticky-mode-enabled', JSON.stringify(true));
        }
    }

    disable() {
        this.#isSticky = false;
        if (browser) {
            localStorage.setItem('sticky-mode-enabled', JSON.stringify(false));
        }
    }
}

export const stickyModeStore = new StickyModeStore();