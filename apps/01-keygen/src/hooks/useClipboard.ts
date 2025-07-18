import { useCallback } from 'react';

interface UseClipboardProps {
  publicKeyDisplay: string | null;
  setError: (error: string | null) => void;
}

/**
 * Custom hook for clipboard operations
 */
export function useClipboard({ publicKeyDisplay, setError }: UseClipboardProps) {
  const handleCopyPublicKey = useCallback(async (): Promise<void> => {
    if (!publicKeyDisplay) {
      setError('No public key available to copy.');
      return;
    }

    setError(null);

    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(publicKeyDisplay);
      } else {
        // Fallback for browsers without Clipboard API
        const textArea = document.createElement('textarea');
        textArea.value = publicKeyDisplay;
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        textArea.select();
        textArea.focus();

        try {
          const successful = document.execCommand('copy');
          if (!successful) {
            throw new Error('Copy command failed');
          }
        } finally {
          document.body.removeChild(textArea);
        }
      }
    } catch {
      setError('Unable to copy to clipboard. Please copy manually.');
    }
  }, [publicKeyDisplay, setError]);

  return { handleCopyPublicKey };
}
