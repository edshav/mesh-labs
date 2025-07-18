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
  const { publicKeyDisplay, setPublicKeyDisplay, isLoading, setIsLoading, error, setError } =
    useKeyPairState();

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
  });

  // Handler function for copying public key to clipboard
  const { handleCopyPublicKey } = useClipboard({
    publicKeyDisplay,
    setError,
  });

  // Handler function for clearing stored keypair
  const { handleClearKeypair } = useKeyPairClear({
    setPublicKeyDisplay,
    setError,
  });

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
