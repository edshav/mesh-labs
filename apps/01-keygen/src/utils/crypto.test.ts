/**
 * Unit tests for crypto utilities
 */

import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  CryptoError,
  decodeKey,
  encodeKey,
  exportKeyPair,
  generateKeyPair,
  importKeyPair,
  isEd25519Supported,
  isWebCryptoSupported,
  KeyGenerationError,
  KeyImportExportError,
  UnsupportedBrowserError,
  type KeyPairData,
} from './crypto';

// Mock crypto.subtle for testing
const mockCrypto = {
  subtle: {
    generateKey: vi.fn(),
    exportKey: vi.fn(),
    importKey: vi.fn(),
  },
};

describe('Crypto Utilities', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset global crypto mock
    Object.defineProperty(globalThis, 'crypto', {
      value: mockCrypto,
      writable: true,
    });
  });

  describe('isWebCryptoSupported', () => {
    it('should return true when Web Crypto API is available', () => {
      expect(isWebCryptoSupported()).toBe(true);
    });

    it('should return false when crypto is undefined', () => {
      Object.defineProperty(globalThis, 'crypto', {
        value: undefined,
        writable: true,
      });
      expect(isWebCryptoSupported()).toBe(false);
    });

    it('should return false when crypto.subtle is undefined', () => {
      Object.defineProperty(globalThis, 'crypto', {
        value: { subtle: undefined },
        writable: true,
      });
      expect(isWebCryptoSupported()).toBe(false);
    });

    it('should return false when generateKey is not a function', () => {
      Object.defineProperty(globalThis, 'crypto', {
        value: { subtle: { generateKey: null } },
        writable: true,
      });
      expect(isWebCryptoSupported()).toBe(false);
    });
  });

  describe('encodeKey', () => {
    it('should encode ArrayBuffer to Base64 string', () => {
      const buffer = new ArrayBuffer(4);
      const view = new Uint8Array(buffer);
      view[0] = 72; // 'H'
      view[1] = 101; // 'e'
      view[2] = 108; // 'l'
      view[3] = 108; // 'l'

      const result = encodeKey(buffer);
      expect(result).toBe('SGVsbA==');
    });

    it('should handle empty ArrayBuffer', () => {
      const buffer = new ArrayBuffer(0);
      const result = encodeKey(buffer);
      expect(result).toBe('');
    });
  });

  describe('decodeKey', () => {
    it('should decode Base64 string to ArrayBuffer', () => {
      const encoded = 'SGVsbA==';
      const result = decodeKey(encoded);
      const view = new Uint8Array(result);

      expect(view.length).toBe(4);
      expect(view[0]).toBe(72); // 'H'
      expect(view[1]).toBe(101); // 'e'
      expect(view[2]).toBe(108); // 'l'
      expect(view[3]).toBe(108); // 'l'
    });

    it('should throw CryptoError for invalid input', () => {
      expect(() => decodeKey('')).toThrow(CryptoError);
      expect(() => decodeKey(null as unknown as string)).toThrow(CryptoError);
      expect(() => decodeKey(undefined as unknown as string)).toThrow(CryptoError);
    });

    it('should throw CryptoError for invalid Base64', () => {
      expect(() => decodeKey('invalid-base64!')).toThrow(CryptoError);
    });
  });

  describe('generateKeyPair', () => {
    it('should generate a valid Ed25519 keypair', async () => {
      const mockKeyPair = {
        publicKey: { type: 'public' },
        privateKey: { type: 'private' },
      };
      mockCrypto.subtle.generateKey.mockResolvedValue(mockKeyPair);

      const result = await generateKeyPair();

      expect(mockCrypto.subtle.generateKey).toHaveBeenCalledWith({ name: 'Ed25519' }, true, [
        'sign',
        'verify',
      ]);
      expect(result).toBe(mockKeyPair);
    });

    it('should throw UnsupportedBrowserError when Web Crypto API is not supported', async () => {
      Object.defineProperty(globalThis, 'crypto', {
        value: undefined,
        writable: true,
      });

      await expect(generateKeyPair()).rejects.toThrow(UnsupportedBrowserError);
    });

    it('should throw UnsupportedBrowserError for NotSupportedError', async () => {
      const error = new Error('Ed25519 not supported');
      error.name = 'NotSupportedError';
      mockCrypto.subtle.generateKey.mockRejectedValue(error);

      await expect(generateKeyPair()).rejects.toThrow(UnsupportedBrowserError);
    });

    it('should throw KeyGenerationError for invalid keypair', async () => {
      mockCrypto.subtle.generateKey.mockResolvedValue(null);

      await expect(generateKeyPair()).rejects.toThrow(KeyGenerationError);
    });

    it('should throw KeyGenerationError for other errors', async () => {
      mockCrypto.subtle.generateKey.mockRejectedValue(new Error('Generic error'));

      await expect(generateKeyPair()).rejects.toThrow(KeyGenerationError);
    });
  });

  describe('exportKeyPair', () => {
    const mockKeyPair = {
      publicKey: { type: 'public' },
      privateKey: { type: 'private' },
    } as CryptoKeyPair;

    it('should export keypair to Base64 strings', async () => {
      const publicKeyBuffer = new ArrayBuffer(4);
      const privateKeyBuffer = new ArrayBuffer(4);

      mockCrypto.subtle.exportKey
        .mockResolvedValueOnce(publicKeyBuffer)
        .mockResolvedValueOnce(privateKeyBuffer);

      const result = await exportKeyPair(mockKeyPair);

      expect(mockCrypto.subtle.exportKey).toHaveBeenCalledWith('spki', mockKeyPair.publicKey);
      expect(mockCrypto.subtle.exportKey).toHaveBeenCalledWith('pkcs8', mockKeyPair.privateKey);
      expect(result).toHaveProperty('publicKey');
      expect(result).toHaveProperty('privateKey');
    });

    it('should throw KeyImportExportError for invalid keypair', async () => {
      await expect(exportKeyPair(null as unknown as CryptoKeyPair)).rejects.toThrow(
        KeyImportExportError
      );
      await expect(exportKeyPair({} as unknown as CryptoKeyPair)).rejects.toThrow(
        KeyImportExportError
      );
    });

    it('should throw UnsupportedBrowserError when Web Crypto API is not supported', async () => {
      Object.defineProperty(globalThis, 'crypto', {
        value: undefined,
        writable: true,
      });

      await expect(exportKeyPair(mockKeyPair)).rejects.toThrow(UnsupportedBrowserError);
    });

    it('should throw UnsupportedBrowserError for NotSupportedError', async () => {
      const error = new Error('Export not supported');
      error.name = 'NotSupportedError';
      mockCrypto.subtle.exportKey.mockRejectedValue(error);

      await expect(exportKeyPair(mockKeyPair)).rejects.toThrow(UnsupportedBrowserError);
    });
  });

  describe('importKeyPair', () => {
    const mockKeyData: KeyPairData = {
      publicKey: 'AAAA', // Base64 for 4 zero bytes
      privateKey: 'AAAA',
    };

    it('should import keypair from Base64 strings', async () => {
      const mockPublicKey = { type: 'public' };
      const mockPrivateKey = { type: 'private' };

      mockCrypto.subtle.importKey
        .mockResolvedValueOnce(mockPublicKey)
        .mockResolvedValueOnce(mockPrivateKey);

      const result = await importKeyPair(mockKeyData);

      expect(mockCrypto.subtle.importKey).toHaveBeenCalledTimes(2);
      expect(result.publicKey).toBe(mockPublicKey);
      expect(result.privateKey).toBe(mockPrivateKey);
    });

    it('should throw KeyImportExportError for invalid key data', async () => {
      await expect(importKeyPair(null as unknown as KeyPairData)).rejects.toThrow(
        KeyImportExportError
      );
      await expect(importKeyPair({} as unknown as KeyPairData)).rejects.toThrow(
        KeyImportExportError
      );
      await expect(importKeyPair({ publicKey: 'test' } as unknown as KeyPairData)).rejects.toThrow(
        KeyImportExportError
      );
    });

    it('should throw UnsupportedBrowserError when Web Crypto API is not supported', async () => {
      Object.defineProperty(globalThis, 'crypto', {
        value: undefined,
        writable: true,
      });

      await expect(importKeyPair(mockKeyData)).rejects.toThrow(UnsupportedBrowserError);
    });

    it('should throw UnsupportedBrowserError for NotSupportedError', async () => {
      const error = new Error('Import not supported');
      error.name = 'NotSupportedError';
      mockCrypto.subtle.importKey.mockRejectedValue(error);

      await expect(importKeyPair(mockKeyData)).rejects.toThrow(UnsupportedBrowserError);
    });

    it('should throw KeyImportExportError for DataError', async () => {
      const error = new Error('Invalid key data');
      error.name = 'DataError';
      mockCrypto.subtle.importKey.mockRejectedValue(error);

      await expect(importKeyPair(mockKeyData)).rejects.toThrow(KeyImportExportError);
    });
  });

  describe('isEd25519Supported', () => {
    it('should return true when Ed25519 is supported', async () => {
      mockCrypto.subtle.generateKey.mockResolvedValue({});

      const result = await isEd25519Supported();

      expect(result).toBe(true);
      expect(mockCrypto.subtle.generateKey).toHaveBeenCalledWith({ name: 'Ed25519' }, false, [
        'sign',
        'verify',
      ]);
    });

    it('should return false when Ed25519 is not supported', async () => {
      mockCrypto.subtle.generateKey.mockRejectedValue(new Error('Not supported'));

      const result = await isEd25519Supported();

      expect(result).toBe(false);
    });
  });

  describe('Error Classes', () => {
    it('should create CryptoError with message and cause', () => {
      const cause = new Error('Original error');
      const error = new CryptoError('Test message', cause);

      expect(error.name).toBe('CryptoError');
      expect(error.message).toBe('Test message');
      expect(error.cause).toBe(cause);
    });

    it('should create UnsupportedBrowserError with default message', () => {
      const error = new UnsupportedBrowserError();

      expect(error.name).toBe('UnsupportedBrowserError');
      expect(error.message).toContain('browser does not support');
    });

    it('should create KeyGenerationError with default message', () => {
      const error = new KeyGenerationError();

      expect(error.name).toBe('KeyGenerationError');
      expect(error.message).toContain('Failed to generate');
    });

    it('should create KeyImportExportError with default message', () => {
      const error = new KeyImportExportError();

      expect(error.name).toBe('KeyImportExportError');
      expect(error.message).toContain('Failed to import or export');
    });
  });
});
