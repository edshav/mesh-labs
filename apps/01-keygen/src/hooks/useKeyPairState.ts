import { useState, useCallback } from 'react';

/**
 * Custom hook for managing keypair state with optimized callbacks
 */
export function useKeyPairState() {
  const [publicKeyDisplay, setPublicKeyDisplay] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [clearSuccess, setClearSuccess] = useState<string | null>(null);

  const clearError = useCallback(() => setError(null), []);

  const setLoadingState = useCallback((loading: boolean) => setIsLoading(loading), []);

  return {
    publicKeyDisplay,
    setPublicKeyDisplay,
    isLoading,
    setIsLoading,
    error,
    setError,
    clearError,
    setLoadingState,
    clearSuccess,
    setClearSuccess,
  };
}
