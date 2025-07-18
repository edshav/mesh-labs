import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useKeyPairClear } from '../useKeyPairClear';
import * as storage from '../../utils/storage';

// Mock the storage module
vi.mock('../../utils/storage', () => ({
  clearKeyPair: vi.fn(),
  StorageError: class StorageError extends Error {
    constructor(message: string) {
      super(message);
      this.name = 'StorageError';
    }
  },
}));

describe('useKeyPairClear', () => {
  const mockSetPublicKeyDisplay = vi.fn();
  const mockSetError = vi.fn();

  const hookProps = {
    setPublicKeyDisplay: mockSetPublicKeyDisplay,
    setError: mockSetError,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should clear keypair successfully', async () => {
    vi.mocked(storage.clearKeyPair).mockImplementation(() => {});

    const { result } = renderHook(() => useKeyPairClear(hookProps));

    await act(async () => {
      await result.current.handleClearKeypair();
    });

    expect(mockSetError).toHaveBeenCalledWith(null);
    expect(storage.clearKeyPair).toHaveBeenCalled();
    expect(mockSetPublicKeyDisplay).toHaveBeenCalledWith(null);
  });

  it('should handle storage errors', async () => {
    const storageError = new storage.StorageError('Clear failed');
    vi.mocked(storage.clearKeyPair).mockImplementation(() => {
      throw storageError;
    });

    const { result } = renderHook(() => useKeyPairClear(hookProps));

    await act(async () => {
      await result.current.handleClearKeypair();
    });

    expect(mockSetError).toHaveBeenCalledWith('Clear failed');
  });

  it('should handle unknown errors', async () => {
    vi.mocked(storage.clearKeyPair).mockImplementation(() => {
      throw new Error('Unknown error');
    });

    const { result } = renderHook(() => useKeyPairClear(hookProps));

    await act(async () => {
      await result.current.handleClearKeypair();
    });

    expect(mockSetError).toHaveBeenCalledWith('Failed to clear stored keys.');
  });
});
