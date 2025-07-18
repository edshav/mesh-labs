import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useClipboard } from '../useClipboard';

describe('useClipboard', () => {
  const mockSetError = vi.fn();
  const testPublicKey = 'test-public-key-base64';

  beforeEach(() => {
    vi.clearAllMocks();
    // Reset DOM
    document.body.innerHTML = '';
  });

  it('should copy to clipboard using Clipboard API', async () => {
    const mockWriteText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText: mockWriteText },
      writable: true,
    });

    const { result } = renderHook(() =>
      useClipboard({
        publicKeyDisplay: testPublicKey,
        setError: mockSetError,
      })
    );

    await act(async () => {
      await result.current.handleCopyPublicKey();
    });

    expect(mockWriteText).toHaveBeenCalledWith(testPublicKey);
    expect(mockSetError).toHaveBeenCalledWith(null);
    expect(result.current.copySuccess).toBe('Public key copied to clipboard!');
  });

  it('should handle missing Clipboard API', async () => {
    // Remove clipboard API
    Object.defineProperty(navigator, 'clipboard', {
      value: undefined,
      writable: true,
    });

    const { result } = renderHook(() =>
      useClipboard({
        publicKeyDisplay: testPublicKey,
        setError: mockSetError,
      })
    );

    await act(async () => {
      await result.current.handleCopyPublicKey();
    });

    expect(mockSetError).toHaveBeenCalledWith(
      'Unable to copy to clipboard. Your browser may not support this feature.'
    );
    expect(result.current.copySuccess).toBe(null);
  });

  it('should handle clipboard API errors', async () => {
    const mockWriteText = vi.fn().mockRejectedValue(new Error('Clipboard failed'));
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText: mockWriteText },
      writable: true,
    });

    const { result } = renderHook(() =>
      useClipboard({
        publicKeyDisplay: testPublicKey,
        setError: mockSetError,
      })
    );

    await act(async () => {
      await result.current.handleCopyPublicKey();
    });

    expect(mockSetError).toHaveBeenCalledWith(
      'Unable to copy to clipboard. Your browser may not support this feature.'
    );
    expect(result.current.copySuccess).toBe(null);
  });

  it('should handle missing writeText method', async () => {
    Object.defineProperty(navigator, 'clipboard', {
      value: {},
      writable: true,
    });

    const { result } = renderHook(() =>
      useClipboard({
        publicKeyDisplay: testPublicKey,
        setError: mockSetError,
      })
    );

    await act(async () => {
      await result.current.handleCopyPublicKey();
    });

    expect(mockSetError).toHaveBeenCalledWith(
      'Unable to copy to clipboard. Your browser may not support this feature.'
    );
    expect(result.current.copySuccess).toBe(null);
  });

  it('should handle missing public key', async () => {
    const { result } = renderHook(() =>
      useClipboard({
        publicKeyDisplay: null,
        setError: mockSetError,
      })
    );

    await act(async () => {
      await result.current.handleCopyPublicKey();
    });

    expect(mockSetError).toHaveBeenCalledWith('No public key available to copy.');
    expect(result.current.copySuccess).toBe(null);
  });

  it('should clear success message after timeout', async () => {
    vi.useFakeTimers();

    const mockWriteText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText: mockWriteText },
      writable: true,
    });

    const { result } = renderHook(() =>
      useClipboard({
        publicKeyDisplay: testPublicKey,
        setError: mockSetError,
      })
    );

    await act(async () => {
      await result.current.handleCopyPublicKey();
    });

    expect(result.current.copySuccess).toBe('Public key copied to clipboard!');

    act(() => {
      vi.advanceTimersByTime(3000);
    });

    expect(result.current.copySuccess).toBe(null);

    vi.useRealTimers();
  });
});
