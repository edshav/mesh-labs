import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useKeyPairStorage } from '../useKeyPairStorage';
import * as crypto from '../../utils/crypto';
import * as storage from '../../utils/storage';

// Mock the crypto and storage modules
vi.mock('../../utils/crypto', () => ({
  importKeyPair: vi.fn(),
  CryptoError: class CryptoError extends Error {
    constructor(message: string) {
      super(message);
      this.name = 'CryptoError';
    }
  },
}));
vi.mock('../../utils/storage', () => ({
  loadKeyPair: vi.fn(),
  StorageError: class StorageError extends Error {
    constructor(message: string) {
      super(message);
      this.name = 'StorageError';
    }
  },
}));

describe('useKeyPairStorage', () => {
  const mockSetPublicKeyDisplay = vi.fn();
  const mockSetIsLoading = vi.fn();
  const mockSetError = vi.fn();

  const hookProps = {
    setPublicKeyDisplay: mockSetPublicKeyDisplay,
    setIsLoading: mockSetIsLoading,
    setError: mockSetError,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should load stored keys successfully', async () => {
    const mockKeyData = { publicKey: 'stored-public-key', privateKey: 'stored-private-key' };
    const mockKeyPair: CryptoKeyPair = {
      publicKey: {} as CryptoKey,
      privateKey: {} as CryptoKey,
    };

    vi.mocked(storage.loadKeyPair).mockReturnValue(mockKeyData);
    vi.mocked(crypto.importKeyPair).mockResolvedValue(mockKeyPair);

    renderHook(() => useKeyPairStorage(hookProps));

    // Wait for useEffect to complete
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(mockSetIsLoading).toHaveBeenCalledWith(true);
    expect(mockSetError).toHaveBeenCalledWith(null);
    expect(storage.loadKeyPair).toHaveBeenCalled();
    expect(crypto.importKeyPair).toHaveBeenCalledWith(mockKeyData);
    expect(mockSetPublicKeyDisplay).toHaveBeenCalledWith(mockKeyData.publicKey);
    expect(mockSetIsLoading).toHaveBeenCalledWith(false);
  });

  it('should handle no stored keys', async () => {
    vi.mocked(storage.loadKeyPair).mockReturnValue(null);

    renderHook(() => useKeyPairStorage(hookProps));

    // Wait for useEffect to complete
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(mockSetIsLoading).toHaveBeenCalledWith(true);
    expect(mockSetError).toHaveBeenCalledWith(null);
    expect(storage.loadKeyPair).toHaveBeenCalled();
    expect(crypto.importKeyPair).not.toHaveBeenCalled();
    expect(mockSetPublicKeyDisplay).not.toHaveBeenCalled();
    expect(mockSetIsLoading).toHaveBeenCalledWith(false);
  });

  it('should handle storage errors', async () => {
    const storageError = new storage.StorageError('Storage failed');
    vi.mocked(storage.loadKeyPair).mockImplementation(() => {
      throw storageError;
    });

    renderHook(() => useKeyPairStorage(hookProps));

    // Wait for useEffect to complete
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(mockSetError).toHaveBeenCalledWith('Storage failed');
    expect(mockSetIsLoading).toHaveBeenCalledWith(false);
  });

  it('should handle crypto errors', async () => {
    const mockKeyData = { publicKey: 'stored-public-key', privateKey: 'stored-private-key' };
    const cryptoError = new crypto.CryptoError('Import failed');

    vi.mocked(storage.loadKeyPair).mockReturnValue(mockKeyData);
    vi.mocked(crypto.importKeyPair).mockRejectedValue(cryptoError);

    renderHook(() => useKeyPairStorage(hookProps));

    // Wait for useEffect to complete
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(mockSetError).toHaveBeenCalledWith('Import failed');
    expect(mockSetIsLoading).toHaveBeenCalledWith(false);
  });

  it('should handle unknown errors', async () => {
    vi.mocked(storage.loadKeyPair).mockImplementation(() => {
      throw new Error('Unknown error');
    });

    renderHook(() => useKeyPairStorage(hookProps));

    // Wait for useEffect to complete
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(mockSetError).toHaveBeenCalledWith('Failed to load stored keys. They may be corrupted.');
    expect(mockSetIsLoading).toHaveBeenCalledWith(false);
  });
});
