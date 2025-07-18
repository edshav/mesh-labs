import { useCallback } from 'react';
import { clearKeyPair as clearStoredKeyPair, StorageError } from '../utils/storage';
import { performSecureMemoryClearing } from '../utils/security';

interface UseKeyPairClearProps {
  setPublicKeyDisplay: (key: string | null) => void;
  setError: (error: string | null) => void;
  setClearSuccess?: (message: string | null) => void;
}

/**
 * Custom hook for clearing stored keypairs with confirmation and security measures
 */
export function useKeyPairClear({
  setPublicKeyDisplay,
  setError,
  setClearSuccess,
}: UseKeyPairClearProps) {
  const handleClearKeypair = useCallback(async (): Promise<void> => {
    setError(null);
    setClearSuccess?.(null);

    // Request user confirmation before clearing (with SSR safety)
    if (typeof window === 'undefined') {
      setError('Key clearing is not available in server-side environment.');
      return;
    }

    const confirmed = window.confirm(
      'Are you sure you want to clear your stored keypair?\n\n' +
        'This action cannot be undone and you will need to generate a new keypair. ' +
        'Your private key will be permanently removed from this browser.'
    );

    if (!confirmed) {
      return;
    }

    try {
      // Clear from localStorage with enhanced security measures
      clearStoredKeyPair();

      // Clear from state
      setPublicKeyDisplay(null);

      // Security: Clear any potential references in component state/memory
      // This helps ensure private key data doesn't linger in memory
      await performSecureMemoryClearing();

      // Provide success feedback
      setClearSuccess?.('Keypair successfully cleared from browser storage and memory.');
    } catch (err) {
      if (err instanceof StorageError) {
        setError(err.message);
      } else {
        setError('Failed to clear stored keys.');
      }
    }
  }, [setPublicKeyDisplay, setError, setClearSuccess]);

  return { handleClearKeypair };
}
