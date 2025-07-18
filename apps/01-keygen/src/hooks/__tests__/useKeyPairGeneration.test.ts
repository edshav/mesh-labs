import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useKeyPairGeneration } from '../useKeyPairGeneration';
import * as crypto from '../../utils/crypto';
import * as storage from '../../utils/storage';

// Mock the crypto and storage modules
vi.mock('../../utils/crypto', () => ({
  generateKeyPair: vi.fn(),
  exportKeyPair: vi.fn(),
  CryptoError: class CryptoError extends Error {
    constructor(message: string) {
      super(message);
      this.name = 'CryptoError';
    }
  },
}));
vi.mock('../../utils/storage', () => ({
  saveKeyPair: vi.fn(),
  StorageError: class StorageError extends Error {
    constructor(message: string) {
      super(message);
      this.name = 'StorageError';
    }
  },
}));

describe('useKeyPairGeneration', () => {
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

  it('should generate keypair successfully', async () => {
    const mockKeyPair: CryptoKeyPair = {
      publicKey: {} as CryptoKey,
      privateKey: {} as CryptoKey,
    };
    const mockKeyData = { publicKey: 'base64-public', privateKey: 'base64-private' };

    vi.mocked(crypto.generateKeyPair).mockResolvedValue(mockKeyPair);
    vi.mocked(crypto.exportKeyPair).mockResolvedValue(mockKeyData);
    vi.mocked(storage.saveKeyPair).mockImplementation(() => {});

    const { result } = renderHook(() => useKeyPairGeneration(hookProps));

    await act(async () => {
      await result.current.handleGenerateKeypair();
    });

    expect(mockSetIsLoading).toHaveBeenCalledWith(true);
    expect(mockSetError).toHaveBeenCalledWith(null);
    expect(crypto.generateKeyPair).toHaveBeenCalled();
    expect(crypto.exportKeyPair).toHaveBeenCalledWith(mockKeyPair);
    expect(storage.saveKeyPair).toHaveBeenCalledWith(mockKeyData);
    expect(mockSetPublicKeyDisplay).toHaveBeenCalledWith(mockKeyData.publicKey);
    expect(mockSetIsLoading).toHaveBeenCalledWith(false);
  });

  it('should handle crypto errors', async () => {
    const cryptoError = new crypto.CryptoError('Crypto failed');
    vi.mocked(crypto.generateKeyPair).mockRejectedValue(cryptoError);

    const { result } = renderHook(() => useKeyPairGeneration(hookProps));

    await act(async () => {
      await result.current.handleGenerateKeypair();
    });

    expect(mockSetIsLoading).toHaveBeenCalledWith(true);
    expect(mockSetError).toHaveBeenCalledWith('Crypto failed');
    expect(mockSetIsLoading).toHaveBeenCalledWith(false);
  });

  it('should handle storage errors', async () => {
    const mockKeyPair: CryptoKeyPair = {
      publicKey: {} as CryptoKey,
      privateKey: {} as CryptoKey,
    };
    const mockKeyData = { publicKey: 'base64-public', privateKey: 'base64-private' };
    const storageError = new storage.StorageError('Storage failed');

    vi.mocked(crypto.generateKeyPair).mockResolvedValue(mockKeyPair);
    vi.mocked(crypto.exportKeyPair).mockResolvedValue(mockKeyData);
    vi.mocked(storage.saveKeyPair).mockImplementation(() => {
      throw storageError;
    });

    const { result } = renderHook(() => useKeyPairGeneration(hookProps));

    await act(async () => {
      await result.current.handleGenerateKeypair();
    });

    expect(mockSetError).toHaveBeenCalledWith('Storage failed');
    expect(mockSetIsLoading).toHaveBeenCalledWith(false);
  });

  it('should handle unknown errors', async () => {
    vi.mocked(crypto.generateKeyPair).mockRejectedValue(new Error('Unknown error'));

    const { result } = renderHook(() => useKeyPairGeneration(hookProps));

    await act(async () => {
      await result.current.handleGenerateKeypair();
    });

    expect(mockSetError).toHaveBeenCalledWith('Failed to generate keypair. Please try again.');
  });
});
