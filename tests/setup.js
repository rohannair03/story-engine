import 'cross-fetch/polyfill';
import '@testing-library/jest-dom';

global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  observe() {}
  unobserve() {}
  disconnect() {}
};