/**
 * Unit tests for storage utility functions
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { KeyPairData } from './crypto';
import {
  clearKeyPair,
  DataIntegrityError,
  isKeyPairStored,
  isLocalStorageAvailable,
  loadKeyPair,
  saveKeyPair,
  StorageError,
  StorageUnavailableError,
} from './storage';

// Mock localStorage
const createLocalStorageMock = () => {
  let store: Record<string, string> = {};

  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      store = {};
    }),
    get length() {
      return Object.keys(store).length;
    },
    key: vi.fn((index: number) => Object.keys(store)[index] || null),
  };
};

// Sample test data
const validKeyPairData: KeyPairData = {
  publicKey: 'MCowBQYDK2VwAyEAGb9ECWmEzf6FQbrBZ9w7lshQhqowtrbLDFw4rXAxZuE=',
  privateKey: 'MC4CAQAwBQYDK2VwBCIEIJ+DYvh6SEqVTm50DFtMDoQikTmiCqirVv9mWG9qfSnF',
};

describe('Storage Utilities', () => {
  let localStorageMock: ReturnType<typeof createLocalStorageMock>;
  let originalLocalStorage: Storage;

  beforeEach(() => {
    // Store original localStorage
    originalLocalStorage = globalThis.localStorage;

    // Create fresh mock
    localStorageMock = createLocalStorageMock();

    // Mock global localStorage
    Object.defineProperty(globalThis, 'localStorage', {
      value: localStorageMock,
      writable: true,
      configurable: true,
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
    // Restore original localStorage
    Object.defineProperty(globalThis, 'localStorage', {
      value: originalLocalStorage,
      writable: true,
      configurable: true,
    });
  });

  describe('isLocalStorageAvailable', () => {
    it('should return true when localStorage is available and functional', () => {
      expect(isLocalStorageAvailable()).toBe(true);
    });

    it('should return false when localStorage is undefined', () => {
      Object.defineProperty(globalThis, 'localStorage', {
        value: undefined,
        writable: true,
        configurable: true,
      });
      expect(isLocalStorageAvailable()).toBe(false);
    });

    it('should return false when localStorage throws an error', () => {
      localStorageMock.setItem.mockImplementation(() => {
        throw new Error('Storage disabled');
      });
      expect(isLocalStorageAvailable()).toBe(false);
    });
  });

  describe('saveKeyPair', () => {
    it('should save valid keypair data successfully', () => {
      expect(() => saveKeyPair(validKeyPairData)).not.toThrow();
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'keypair',
        expect.stringContaining(validKeyPairData.publicKey)
      );
    });

    it('should throw StorageUnavailableError when localStorage is not available', () => {
      Object.defineProperty(globalThis, 'localStorage', {
        value: undefined,
        writable: true,
        configurable: true,
      });

      expect(() => saveKeyPair(validKeyPairData)).toThrow(StorageUnavailableError);
    });

    it('should throw StorageError for invalid key data - missing publicKey', () => {
      const invalidData = { publicKey: '', privateKey: validKeyPairData.privateKey };
      expect(() => saveKeyPair(invalidData)).toThrow(StorageError);
      expect(() => saveKeyPair(invalidData)).toThrow('Invalid key data');
    });

    it('should throw StorageError for invalid key data - missing privateKey', () => {
      const invalidData = { publicKey: validKeyPairData.publicKey, privateKey: '' };
      expect(() => saveKeyPair(invalidData)).toThrow(StorageError);
      expect(() => saveKeyPair(invalidData)).toThrow('Invalid key data');
    });

    it('should throw StorageError for null key data', () => {
      expect(() => saveKeyPair(null as unknown as KeyPairData)).toThrow(StorageError);
      expect(() => saveKeyPair(null as unknown as KeyPairData)).toThrow('Invalid key data');
    });

    it('should throw StorageError when quota is exceeded', () => {
      // Mock setItem to throw QuotaExceededError, but keep getItem working for availability check
      localStorageMock.setItem.mockImplementation((key: string) => {
        if (key === '__storage_test__') {
          // Allow the test key to work for availability check
          return;
        }
        const error = new Error('Quota exceeded');
        error.name = 'QuotaExceededError';
        throw error;
      });

      expect(() => saveKeyPair(validKeyPairData)).toThrow(StorageError);
      expect(() => saveKeyPair(validKeyPairData)).toThrow('Storage quota exceeded');
    });

    it('should include algorithm and timestamp in stored data', () => {
      const beforeTime = Date.now();
      saveKeyPair(validKeyPairData);
      const afterTime = Date.now();

      expect(localStorageMock.setItem).toHaveBeenCalledWith('keypair', expect.any(String));

      // Get the actual stored data from the mock call
      const setItemCall = localStorageMock.setItem.mock.calls.find((call) => call[0] === 'keypair');
      expect(setItemCall).toBeDefined();

      const storedData = JSON.parse(setItemCall![1]);
      expect(storedData.algorithm).toBe('Ed25519');
      expect(storedData.created).toBeGreaterThanOrEqual(beforeTime);
      expect(storedData.created).toBeLessThanOrEqual(afterTime);
      expect(storedData.publicKey).toBe(validKeyPairData.publicKey);
      expect(storedData.privateKey).toBe(validKeyPairData.privateKey);
    });
  });

  describe('loadKeyPair', () => {
    it('should return null when no keypair is stored', () => {
      expect(loadKeyPair()).toBeNull();
    });

    it('should load valid stored keypair successfully', () => {
      // First save a keypair
      saveKeyPair(validKeyPairData);

      // Then load it
      const loaded = loadKeyPair();
      expect(loaded).toEqual(validKeyPairData);
    });

    it('should throw StorageUnavailableError when localStorage is not available', () => {
      Object.defineProperty(globalThis, 'localStorage', {
        value: undefined,
        writable: true,
        configurable: true,
      });

      expect(() => loadKeyPair()).toThrow(StorageUnavailableError);
    });

    it('should throw DataIntegrityError for corrupted JSON data', () => {
      localStorageMock.getItem.mockReturnValue('invalid json {');

      expect(() => loadKeyPair()).toThrow(DataIntegrityError);
      expect(() => loadKeyPair()).toThrow('corrupted: invalid JSON format');
    });

    it('should throw DataIntegrityError for invalid data structure - missing publicKey', () => {
      const invalidData = {
        privateKey: validKeyPairData.privateKey,
        algorithm: 'Ed25519',
        created: Date.now(),
      };
      localStorageMock.getItem.mockReturnValue(JSON.stringify(invalidData));

      expect(() => loadKeyPair()).toThrow(DataIntegrityError);
      expect(() => loadKeyPair()).toThrow('corrupted or in an invalid format');
    });

    it('should throw DataIntegrityError for invalid data structure - wrong algorithm', () => {
      const invalidData = {
        publicKey: validKeyPairData.publicKey,
        privateKey: validKeyPairData.privateKey,
        algorithm: 'RSA',
        created: Date.now(),
      };
      localStorageMock.getItem.mockReturnValue(JSON.stringify(invalidData));

      expect(() => loadKeyPair()).toThrow(DataIntegrityError);
    });

    it('should throw DataIntegrityError for invalid data structure - missing timestamp', () => {
      const invalidData = {
        publicKey: validKeyPairData.publicKey,
        privateKey: validKeyPairData.privateKey,
        algorithm: 'Ed25519',
      };
      localStorageMock.getItem.mockReturnValue(JSON.stringify(invalidData));

      expect(() => loadKeyPair()).toThrow(DataIntegrityError);
    });

    it('should throw DataIntegrityError for empty key values', () => {
      const invalidData = {
        publicKey: '',
        privateKey: validKeyPairData.privateKey,
        algorithm: 'Ed25519',
        created: Date.now(),
      };
      localStorageMock.getItem.mockReturnValue(JSON.stringify(invalidData));

      expect(() => loadKeyPair()).toThrow(DataIntegrityError);
    });
  });

  describe('clearKeyPair', () => {
    it('should clear stored keypair successfully', () => {
      // First save a keypair
      saveKeyPair(validKeyPairData);
      expect(isKeyPairStored()).toBe(true);

      // Then clear it
      expect(() => clearKeyPair()).not.toThrow();
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('keypair');
      expect(isKeyPairStored()).toBe(false);
    });

    it('should throw StorageUnavailableError when localStorage is not available', () => {
      Object.defineProperty(globalThis, 'localStorage', {
        value: undefined,
        writable: true,
        configurable: true,
      });

      expect(() => clearKeyPair()).toThrow(StorageUnavailableError);
    });

    it('should throw StorageError when removal fails', () => {
      // Mock removeItem to throw error, but keep getItem working for availability check
      localStorageMock.removeItem.mockImplementation((key: string) => {
        if (key === '__storage_test__') {
          // Allow the test key to work for availability check
          return;
        }
        throw new Error('Removal failed');
      });

      expect(() => clearKeyPair()).toThrow(StorageError);
      expect(() => clearKeyPair()).toThrow('Failed to clear keypair');
    });
  });

  describe('isKeyPairStored', () => {
    it('should return false when no keypair is stored', () => {
      expect(isKeyPairStored()).toBe(false);
    });

    it('should return true when a keypair is stored', () => {
      saveKeyPair(validKeyPairData);
      expect(isKeyPairStored()).toBe(true);
    });

    it('should return false when localStorage is not available', () => {
      Object.defineProperty(globalThis, 'localStorage', {
        value: undefined,
        writable: true,
        configurable: true,
      });

      expect(isKeyPairStored()).toBe(false);
    });

    it('should return false when localStorage throws an error', () => {
      localStorageMock.getItem.mockImplementation(() => {
        throw new Error('Access denied');
      });

      expect(isKeyPairStored()).toBe(false);
    });
  });

  describe('Error handling integration', () => {
    it('should handle complete localStorage unavailability gracefully', () => {
      Object.defineProperty(globalThis, 'localStorage', {
        value: undefined,
        writable: true,
        configurable: true,
      });

      expect(() => saveKeyPair(validKeyPairData)).toThrow(StorageUnavailableError);
      expect(() => loadKeyPair()).toThrow(StorageUnavailableError);
      expect(() => clearKeyPair()).toThrow(StorageUnavailableError);
      expect(isKeyPairStored()).toBe(false);
    });

    it('should maintain data integrity across save/load cycles', () => {
      // Save keypair
      saveKeyPair(validKeyPairData);

      // Load and verify
      const loaded = loadKeyPair();
      expect(loaded).toEqual(validKeyPairData);

      // Clear and verify
      clearKeyPair();
      expect(loadKeyPair()).toBeNull();
      expect(isKeyPairStored()).toBe(false);
    });

    it('should handle storage corruption gracefully', () => {
      // Manually corrupt the stored data
      localStorageMock.getItem.mockReturnValue('corrupted data');

      expect(() => loadKeyPair()).toThrow(DataIntegrityError);

      // Should still be able to clear corrupted data
      expect(() => clearKeyPair()).not.toThrow();
    });
  });

  describe('Fallback behavior', () => {
    it('should provide meaningful error messages for different failure scenarios', () => {
      // Test quota exceeded error message
      localStorageMock.setItem.mockImplementation((key: string) => {
        if (key === '__storage_test__') {
          // Allow the test key to work for availability check
          return;
        }
        const error = new Error('Quota exceeded');
        error.name = 'QuotaExceededError';
        throw error;
      });

      try {
        saveKeyPair(validKeyPairData);
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error).toBeInstanceOf(StorageError);
        expect((error as StorageError).message).toContain('Storage quota exceeded');
        expect((error as StorageError).message).toContain('clear some browser data');
      }

      // Reset the mock for the next test
      localStorageMock.setItem.mockReset();

      // Test private browsing mode error message
      Object.defineProperty(globalThis, 'localStorage', {
        value: undefined,
        writable: true,
        configurable: true,
      });

      try {
        saveKeyPair(validKeyPairData);
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error).toBeInstanceOf(StorageUnavailableError);
        expect((error as StorageUnavailableError).message).toContain('private browsing mode');
      }
    });

    it('should handle edge cases in data validation', () => {
      // Test with various invalid data structures
      const testCases = [
        { data: null, description: 'null data' },
        { data: undefined, description: 'undefined data' },
        { data: {}, description: 'empty object' },
        { data: { publicKey: null }, description: 'null publicKey' },
        { data: { privateKey: null }, description: 'null privateKey' },
        { data: { publicKey: 123 }, description: 'non-string publicKey' },
        { data: { privateKey: 123 }, description: 'non-string privateKey' },
      ];

      testCases.forEach(({ data, description }) => {
        expect(
          () => saveKeyPair(data as unknown as KeyPairData),
          `Should throw for ${description}`
        ).toThrow(StorageError);
      });
    });
  });
});
