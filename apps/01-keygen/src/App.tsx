import { useEffect, useState } from 'react';
import { KeyViewer } from './components/KeyViewer';
import { CryptoError, exportKeyPair, generateKeyPair, importKeyPair } from './utils/crypto';
import {
  clearKeyPair as clearStoredKeyPair,
  loadKeyPair,
  saveKeyPair,
  StorageError,
} from './utils/storage';

function App() {
  // State management for keypair operations
  const [publicKeyDisplay, setPublicKeyDisplay] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Load stored keys on app initialization
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
  }, []);

  // Handler function for generating new keypair
  const handleGenerateKeypair = async (): Promise<void> => {
    setIsLoading(true);
    setError(null);

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
  };

  // Handler function for copying public key to clipboard
  const handleCopyPublicKey = async (): Promise<void> => {
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
  };

  // Handler function for clearing stored keypair
  const handleClearKeypair = async (): Promise<void> => {
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
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">
            Ed25519 Key Generator
          </h1>

          <KeyViewer
            publicKey={publicKeyDisplay}
            onGenerate={handleGenerateKeypair}
            onCopy={handleCopyPublicKey}
            onClear={handleClearKeypair}
            loading={isLoading}
            error={error}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
