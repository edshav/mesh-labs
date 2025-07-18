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

// Mock window.confirm
const mockConfirm = vi.fn();
Object.defineProperty(window, 'confirm', {
  value: mockConfirm,
  writable: true,
});

describe('useKeyPairClear', () => {
  const mockSetPublicKeyDisplay = vi.fn();
  const mockSetError = vi.fn();
  const mockSetClearSuccess = vi.fn();

  const hookProps = {
    setPublicKeyDisplay: mockSetPublicKeyDisplay,
    setError: mockSetError,
    setClearSuccess: mockSetClearSuccess,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockConfirm.mockReturnValue(true); // Default to confirmed
  });

  it('should clear keypair successfully with confirmation', async () => {
    vi.mocked(storage.clearKeyPair).mockImplementation(() => {});
    mockConfirm.mockReturnValue(true);

    const { result } = renderHook(() => useKeyPairClear(hookProps));

    await act(async () => {
      await result.current.handleClearKeypair();
    });

    expect(mockConfirm).toHaveBeenCalledWith(
      expect.stringContaining('Are you sure you want to clear your stored keypair?')
    );
    expect(mockSetError).toHaveBeenCalledWith(null);
    expect(mockSetClearSuccess).toHaveBeenCalledWith(null);
    expect(storage.clearKeyPair).toHaveBeenCalled();
    expect(mockSetPublicKeyDisplay).toHaveBeenCalledWith(null);
    expect(mockSetClearSuccess).toHaveBeenCalledWith(
      'Keypair successfully cleared from browser storage and memory.'
    );
  });

  it('should not clear keypair when user cancels confirmation', async () => {
    mockConfirm.mockReturnValue(false);

    const { result } = renderHook(() => useKeyPairClear(hookProps));

    await act(async () => {
      await result.current.handleClearKeypair();
    });

    expect(mockConfirm).toHaveBeenCalled();
    expect(storage.clearKeyPair).not.toHaveBeenCalled();
    expect(mockSetPublicKeyDisplay).not.toHaveBeenCalled();
    expect(mockSetClearSuccess).not.toHaveBeenCalledWith(
      expect.stringContaining('successfully cleared')
    );
  });

  it('should handle storage errors', async () => {
    const storageError = new storage.StorageError('Clear failed');
    vi.mocked(storage.clearKeyPair).mockImplementation(() => {
      throw storageError;
    });
    mockConfirm.mockReturnValue(true);

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
    mockConfirm.mockReturnValue(true);

    const { result } = renderHook(() => useKeyPairClear(hookProps));

    await act(async () => {
      await result.current.handleClearKeypair();
    });

    expect(mockSetError).toHaveBeenCalledWith('Failed to clear stored keys.');
  });

  it('should clear success message before clearing', async () => {
    vi.mocked(storage.clearKeyPair).mockImplementation(() => {});
    mockConfirm.mockReturnValue(true);

    const { result } = renderHook(() => useKeyPairClear(hookProps));

    await act(async () => {
      await result.current.handleClearKeypair();
    });

    // Verify that setClearSuccess is called with null first (to clear any existing message)
    expect(mockSetClearSuccess).toHaveBeenNthCalledWith(1, null);
    // Then called with success message
    expect(mockSetClearSuccess).toHaveBeenNthCalledWith(
      2,
      'Keypair successfully cleared from browser storage and memory.'
    );
  });
});
