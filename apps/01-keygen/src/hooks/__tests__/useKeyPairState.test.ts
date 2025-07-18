import { renderHook, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { useKeyPairState } from '../useKeyPairState';

describe('useKeyPairState', () => {
  it('should initialize with default values', () => {
    const { result } = renderHook(() => useKeyPairState());

    expect(result.current.publicKeyDisplay).toBeNull();
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('should update publicKeyDisplay', () => {
    const { result } = renderHook(() => useKeyPairState());
    const testKey = 'test-public-key';

    act(() => {
      result.current.setPublicKeyDisplay(testKey);
    });

    expect(result.current.publicKeyDisplay).toBe(testKey);
  });

  it('should update loading state', () => {
    const { result } = renderHook(() => useKeyPairState());

    act(() => {
      result.current.setIsLoading(true);
    });

    expect(result.current.isLoading).toBe(true);

    act(() => {
      result.current.setLoadingState(false);
    });

    expect(result.current.isLoading).toBe(false);
  });

  it('should update error state', () => {
    const { result } = renderHook(() => useKeyPairState());
    const testError = 'Test error message';

    act(() => {
      result.current.setError(testError);
    });

    expect(result.current.error).toBe(testError);
  });

  it('should clear error', () => {
    const { result } = renderHook(() => useKeyPairState());
    const testError = 'Test error message';

    act(() => {
      result.current.setError(testError);
    });

    expect(result.current.error).toBe(testError);

    act(() => {
      result.current.clearError();
    });

    expect(result.current.error).toBeNull();
  });
});
