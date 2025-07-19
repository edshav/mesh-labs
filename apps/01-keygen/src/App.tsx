import { KeyViewer } from './components/KeyViewer';
import { EducationalContent } from './components/EducationalContent';
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
            <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto mb-4">
              Learn cryptography hands-on by generating secure Ed25519 keypairs using the Web Crypto
              API. This educational tool demonstrates modern cryptographic key management entirely
              in your browser.
            </p>
            <div className="flex items-center justify-center space-x-4 text-xs text-gray-500">
              <div className="flex items-center">
                <svg
                  className="w-4 h-4 mr-1 text-green-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                Browser-based
              </div>
              <div className="flex items-center">
                <svg
                  className="w-4 h-4 mr-1 text-green-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                No server required
              </div>
              <div className="flex items-center">
                <svg
                  className="w-4 h-4 mr-1 text-green-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                Educational
              </div>
            </div>
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

          {/* Educational Content Section */}
          <div className="mt-8 pt-8 border-t border-gray-200">
            <EducationalContent />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
