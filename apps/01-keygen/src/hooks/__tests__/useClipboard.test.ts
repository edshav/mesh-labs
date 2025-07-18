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
  });

  it('should use fallback method when Clipboard API is not available', async () => {
    // Mock document.execCommand
    const mockExecCommand = vi.fn().mockReturnValue(true);
    Object.defineProperty(document, 'execCommand', {
      value: mockExecCommand,
      writable: true,
    });

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

    expect(mockExecCommand).toHaveBeenCalledWith('copy');
    expect(mockSetError).toHaveBeenCalledWith(null);
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

    expect(mockSetError).toHaveBeenCalledWith('Unable to copy to clipboard. Please copy manually.');
  });

  it('should handle fallback method errors', async () => {
    const mockExecCommand = vi.fn().mockReturnValue(false);
    Object.defineProperty(document, 'execCommand', {
      value: mockExecCommand,
      writable: true,
    });

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

    expect(mockSetError).toHaveBeenCalledWith('Unable to copy to clipboard. Please copy manually.');
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
  });
});
