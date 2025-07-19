import { KeyViewer } from './components/KeyViewer';
import {
  useKeyPairState,
  useKeyPairStorage,
  useKeyPairGeneration,
  useClipboard,
  useKeyPairClear,
} from './hooks';

function App() {
  // State management for keypair operations
  const {
    publicKeyDisplay,
    setPublicKeyDisplay,
    isLoading,
    setIsLoading,
    error,
    setError,
    clearSuccess,
    setClearSuccess,
  } = useKeyPairState();

  // Load stored keys on app initialization
  useKeyPairStorage({
    setPublicKeyDisplay,
    setIsLoading,
    setError,
  });

  // Handler function for generating new keypair
  const { handleGenerateKeypair } = useKeyPairGeneration({
    setPublicKeyDisplay,
    setIsLoading,
    setError,
    setClearSuccess,
  });

  // Handler function for copying public key to clipboard
  const { handleCopyPublicKey, copySuccess } = useClipboard({
    publicKeyDisplay,
    setError,
    setClearSuccess,
  });

  // Handler function for clearing stored keypair
  const { handleClearKeypair } = useKeyPairClear({
    setPublicKeyDisplay,
    setError,
    setClearSuccess,
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-4 sm:py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 lg:p-8">
          <div className="text-center mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
              Ed25519 Key Generator
            </h1>
            <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto">
              Generate secure cryptographic keypairs using the Web Crypto API. Your private key
              never leaves your browser.
            </p>
          </div>

          <KeyViewer
            publicKey={publicKeyDisplay}
            onGenerate={handleGenerateKeypair}
            onCopy={handleCopyPublicKey}
            onClear={handleClearKeypair}
            loading={isLoading}
            error={error}
            copySuccess={copySuccess}
            clearSuccess={clearSuccess}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
