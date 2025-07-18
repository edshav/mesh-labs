import { useCallback, useState } from 'react';

interface UseClipboardProps {
  publicKeyDisplay: string | null;
  setError: (error: string | null) => void;
  setClearSuccess?: (message: string | null) => void;
}

/**
 * Custom hook for clipboard operations with visual feedback
 */
export function useClipboard({ publicKeyDisplay, setError, setClearSuccess }: UseClipboardProps) {
  const [copySuccess, setCopySuccess] = useState<string | null>(null);

  const handleCopyPublicKey = useCallback(async (): Promise<void> => {
    if (!publicKeyDisplay) {
      setError('No public key available to copy.');
      return;
    }

    setError(null);
    setCopySuccess(null);
    setClearSuccess?.(null);

    try {
      if (!navigator.clipboard || !navigator.clipboard.writeText) {
        throw new Error('Clipboard API not supported');
      }

      await navigator.clipboard.writeText(publicKeyDisplay);

      // Show success feedback
      setCopySuccess('Public key copied to clipboard!');

      // Clear success message after 3 seconds
      setTimeout(() => {
        setCopySuccess(null);
      }, 3000);
    } catch {
      setError('Unable to copy to clipboard. Your browser may not support this feature.');
    }
  }, [publicKeyDisplay, setError, setClearSuccess]);

  return { handleCopyPublicKey, copySuccess };
}
