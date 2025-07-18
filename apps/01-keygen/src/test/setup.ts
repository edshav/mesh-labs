// Test setup file for Vitest
import { beforeEach, vi } from 'vitest';

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

// Mock Web Crypto API
const cryptoMock = {
  subtle: {
    generateKey: vi.fn(),
    exportKey: vi.fn(),
    importKey: vi.fn(),
  },
};

// Mock navigator.clipboard
const clipboardMock = {
  writeText: vi.fn(),
};

// Mock document.execCommand
const execCommandMock = vi.fn();

beforeEach(() => {
  // Reset all mocks before each test
  vi.clearAllMocks();

  // Setup global mocks for jsdom environment
  Object.defineProperty(globalThis, 'localStorage', {
    value: localStorageMock,
    writable: true,
  });

  Object.defineProperty(globalThis, 'crypto', {
    value: cryptoMock,
    writable: true,
  });

  Object.defineProperty(globalThis, 'navigator', {
    value: {
      clipboard: clipboardMock,
    },
    writable: true,
  });

  if (typeof document !== 'undefined') {
    Object.defineProperty(document, 'execCommand', {
      value: execCommandMock,
      writable: true,
    });
  }
});
