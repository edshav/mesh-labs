import { useState } from 'react';

/**
 * Custom hook for managing keypair state
 */
export function useKeyPairState() {
  const [publicKeyDisplay, setPublicKeyDisplay] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = () => setError(null);

  const setLoadingState = (loading: boolean) => setIsLoading(loading);

  return {
    publicKeyDisplay,
    setPublicKeyDisplay,
    isLoading,
    setIsLoading,
    error,
    setError,
    clearError,
    setLoadingState,
  };
}
