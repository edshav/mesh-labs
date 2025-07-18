import { useEffect } from 'react';
import { CryptoError, importKeyPair } from '../utils/crypto';
import { loadKeyPair, StorageError } from '../utils/storage';

interface UseKeyPairStorageProps {
  setPublicKeyDisplay: (key: string | null) => void;
  setIsLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

/**
 * Custom hook for loading stored keypairs on app initialization
 */
export function useKeyPairStorage({
  setPublicKeyDisplay,
  setIsLoading,
  setError,
}: UseKeyPairStorageProps) {
  useEffect(() => {
    const loadStoredKeys = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const storedKeyData = loadKeyPair();

        if (storedKeyData) {
          // Import the stored keypair to validate it
          await importKeyPair(storedKeyData);
          setPublicKeyDisplay(storedKeyData.publicKey);
        }
      } catch (err) {
        if (err instanceof StorageError || err instanceof CryptoError) {
          setError(err.message);
        } else {
          setError('Failed to load stored keys. They may be corrupted.');
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadStoredKeys();
  }, [setPublicKeyDisplay, setIsLoading, setError]);
}
