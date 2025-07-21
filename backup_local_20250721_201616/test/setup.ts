import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock do console.error para capturar erros nos testes
Object.defineProperty(console, 'error', {
  value: vi.fn(),
  writable: true
});

// Mock do console.warn para capturar warnings nos testes
Object.defineProperty(console, 'warn', {
  value: vi.fn(),
  writable: true
});

// Mock de window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
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

// Mock de ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock de fetch
global.fetch = vi.fn();

// Mock de URL.createObjectURL
Object.defineProperty(URL, 'createObjectURL', {
  value: vi.fn(() => 'mock-object-url')
});

Object.defineProperty(URL, 'revokeObjectURL', {
  value: vi.fn()
}); 