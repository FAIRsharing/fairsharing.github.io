import { vi } from "vitest";

// --- 1. ResizeObserver Polyfill ---
// Vuetify uses this to detect when elements (like drawers or cards) change size.
// JSDOM doesn't support it, so we mock it to prevent crashes.
global.ResizeObserver = class ResizeObserver {
  constructor(callback) {
    this.callback = callback;
  }
  observe() {}
  unobserve() {}
  disconnect() {}
};

// --- 2. IntersectionObserver Polyfill ---
// Used by Vuetify for lazy-loading images or infinite scrolling.
global.IntersectionObserver = class IntersectionObserver {
  constructor(callback) {
    this.callback = callback;
  }
  observe() {}
  unobserve() {}
  disconnect() {}
};

// --- 3. window.matchMedia Polyfill ---
// CRITICAL for $vuetify.display (mdAndDown, lgAndUp, etc.)
// We default 'matches' to false, meaning the test assumes "Desktop" view by default.
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// --- 4. Mock global CSS support ---
// Prevents errors in some Vuetify computed properties
global.CSS = {
  supports: () => false,
  escape: (str) => str,
};

// --- 5. Silence Vue warnings (Optional) ---
// If you want to suppress specific warnings (like "Vuetify is not installed"), you can do it here.
// const originalConsoleWarn = console.warn;
// console.warn = (...args) => {
//   if (args[0].includes('Vuetify')) return;
//   originalConsoleWarn(...args);
// };
