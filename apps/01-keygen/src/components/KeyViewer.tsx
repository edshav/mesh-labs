import React from 'react';

// Props interface for KeyViewer component
export interface KeyViewerProps {
  publicKey: string | null;
  onGenerate: () => Promise<void>;
  onCopy: () => Promise<void>;
  onClear: () => Promise<void>;
  loading: boolean;
  error: string | null;
}

/**
 * KeyViewer component for displaying public key and providing key management actions
 * Ensures private key is never displayed in the UI
 */
export const KeyViewer: React.FC<KeyViewerProps> = ({
  publicKey,
  onGenerate,
  onCopy,
  onClear,
  loading,
  error,
}) => {
  return (
    <div className="space-y-4">
      {/* Error display */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-800 text-sm">{error}</p>
        </div>
      )}

      {/* Loading state */}
      {loading && (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
            <p className="text-blue-800 text-sm">Processing...</p>
          </div>
        </div>
      )}

      {/* Conditional rendering based on key existence */}
      {publicKey ? (
        <div>
          <h2 className="text-lg font-semibold text-gray-700 mb-3">Your Public Key</h2>

          {/* Public key display with proper formatting */}
          <div className="bg-gray-100 border border-gray-200 rounded-md p-4">
            <div className="font-mono text-sm text-gray-800 break-all leading-relaxed">
              {publicKey}
            </div>
          </div>

          {/* Educational note */}
          <p className="text-xs text-gray-500 mt-2">
            This is your public key in Base64 format. It's safe to share this key with others. Your
            private key is securely stored and never displayed.
          </p>
        </div>
      ) : (
        <div className="text-center py-8">
          <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-6">
            <div className="text-gray-400 mb-2">
              <svg
                className="mx-auto h-12 w-12"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M15 7a2 2 0 012 2m0 0a2 2 0 012 2v6a2 2 0 01-2 2H9a2 2 0 01-2-2V9a2 2 0 012-2m0 0V7a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-700 mb-2">No Keypair Available</h3>
            <p className="text-gray-500 text-sm">
              Generate a new Ed25519 keypair to get started with cryptographic operations.
            </p>
          </div>
        </div>
      )}

      {/* Action buttons */}
      <div className="flex flex-wrap gap-3 justify-center pt-4">
        <button
          aria-label="Generate a new Ed25519 keypair"
          onClick={onGenerate}
          disabled={loading}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {publicKey ? 'Generate New Keypair' : 'Generate Keypair'}
        </button>

        {/* Copy button - only shown when public key exists */}
        {publicKey && (
          <button
            aria-label="Copy your public key to clipboard"
            onClick={onCopy}
            disabled={loading}
            className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Copy to Clipboard
          </button>
        )}

        {/* Clear button - only shown when public key exists */}
        {publicKey && (
          <button
            aria-label="Clear stored keypair from browser"
            onClick={onClear}
            disabled={loading}
            className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Clear Stored Keypair
          </button>
        )}
      </div>
    </div>
  );
};

export default KeyViewer;
