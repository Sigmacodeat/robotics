// Jest setup: add @testing-library/jest-dom matchers
import '@testing-library/jest-dom';

// Polyfill IntersectionObserver for jsdom environment (used by framer-motion InView)
class MockIntersectionObserver {
  constructor(private _callback: IntersectionObserverCallback) {}
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords(): IntersectionObserverEntry[] { return []; }
}

type GlobalWithIO = typeof globalThis & {
  IntersectionObserver?: typeof IntersectionObserver;
};

const g = globalThis as GlobalWithIO;
if (typeof g.IntersectionObserver === 'undefined') {
  g.IntersectionObserver = MockIntersectionObserver as unknown as typeof IntersectionObserver;
}
