import { useCallback } from 'react';
import { clearKeyPair as clearStoredKeyPair, StorageError } from '../utils/storage';

interface UseKeyPairClearProps {
  setPublicKeyDisplay: (key: string | null) => void;
  setError: (error: string | null) => void;
}

/**
 * Custom hook for clearing stored keypairs
 */
export function useKeyPairClear({ setPublicKeyDisplay, setError }: UseKeyPairClearProps) {
  const handleClearKeypair = useCallback(async (): Promise<void> => {
    setError(null);

    try {
      // Clear from localStorage
      clearStoredKeyPair();

      // Clear from state
      setPublicKeyDisplay(null);
    } catch (err) {
      if (err instanceof StorageError) {
        setError(err.message);
      } else {
        setError('Failed to clear stored keys.');
      }
    }
  }, [setPublicKeyDisplay, setError]);

  return { handleClearKeypair };
}
