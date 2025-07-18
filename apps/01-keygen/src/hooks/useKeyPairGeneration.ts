import { useCallback } from 'react';
import { CryptoError, exportKeyPair, generateKeyPair } from '../utils/crypto';
import { saveKeyPair, StorageError } from '../utils/storage';

interface UseKeyPairGenerationProps {
  setPublicKeyDisplay: (key: string | null) => void;
  setIsLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setClearSuccess?: (message: string | null) => void;
}

/**
 * Custom hook for keypair generation functionality
 */
export function useKeyPairGeneration({
  setPublicKeyDisplay,
  setIsLoading,
  setError,
  setClearSuccess,
}: UseKeyPairGenerationProps) {
  const handleGenerateKeypair = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    setError(null);
    setClearSuccess?.(null);

    try {
      // Generate new keypair
      const newKeypair = await generateKeyPair();

      // Export for storage and display
      const keyData = await exportKeyPair(newKeypair);

      // Save to localStorage
      saveKeyPair(keyData);

      // Update state
      setPublicKeyDisplay(keyData.publicKey);
    } catch (err) {
      if (err instanceof CryptoError || err instanceof StorageError) {
        setError(err.message);
      } else {
        setError('Failed to generate keypair. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  }, [setPublicKeyDisplay, setIsLoading, setError, setClearSuccess]);

  return { handleGenerateKeypair };
}
