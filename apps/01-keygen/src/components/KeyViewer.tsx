import React from 'react';

// Props interface for KeyViewer component
export interface KeyViewerProps {
  publicKey: string | null;
  onGenerate: () => Promise<void>;
  onCopy: () => Promise<void>;
  onClear: () => Promise<void>;
  loading: boolean;
  error: string | null;
  copySuccess?: string | null;
  clearSuccess?: string | null;
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
  copySuccess,
  clearSuccess,
}) => {
  return (
    <div className="space-y-4">
      {/* Error display */}
      {error && (
        <div
          className="p-4 bg-red-50 border border-red-200 rounded-md"
          role="alert"
          aria-live="assertive"
          aria-atomic="true"
        >
          <p className="text-red-800 text-sm">{error}</p>
        </div>
      )}

      {/* Success message display */}
      {copySuccess && (
        <div
          className="p-4 bg-green-50 border border-green-200 rounded-md"
          role="status"
          aria-live="polite"
          aria-atomic="true"
        >
          <p className="text-green-800 text-sm flex items-center">
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            {copySuccess}
          </p>
        </div>
      )}

      {/* Clear success message display */}
      {clearSuccess && (
        <div
          className="p-4 bg-blue-50 border border-blue-200 rounded-md"
          role="status"
          aria-live="polite"
          aria-atomic="true"
        >
          <p className="text-blue-800 text-sm flex items-center">
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
            {clearSuccess}
          </p>
        </div>
      )}

      {/* Conditional rendering based on key existence */}
      {publicKey ? (
        <div>
          <h2 className="text-lg font-semibold text-gray-700 mb-3">Your Public Key</h2>

          {/* Public key display with proper formatting */}
          <div
            className="bg-gray-100 border border-gray-200 rounded-md p-4"
            role="region"
            aria-label="Public key display"
          >
            <div
              className="font-mono text-sm text-gray-800 break-all leading-relaxed"
              aria-label="Your public key in Base64 format"
              tabIndex={0}
            >
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
      <div className="relative flex flex-wrap gap-3 justify-center pt-4">
        {/* Loading spinner overlay */}
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/50 rounded-md">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          </div>
        )}

        <button
          aria-label="Generate a new Ed25519 keypair"
          aria-describedby="generate-help-text"
          onClick={onGenerate}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onGenerate();
            }
          }}
          disabled={loading}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors min-w-[180px]"
        >
          {publicKey ? 'Generate New Keypair' : 'Generate Keypair'}
        </button>

        {/* Copy button - only shown when public key exists */}
        {publicKey && (
          <button
            aria-label="Copy your public key to clipboard"
            aria-describedby="copy-help-text"
            onClick={onCopy}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onCopy();
              }
            }}
            disabled={loading}
            className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors min-w-[160px]"
          >
            Copy to Clipboard
          </button>
        )}

        {/* Clear button - only shown when public key exists */}
        {publicKey && (
          <button
            aria-label="Clear stored keypair from browser"
            aria-describedby="clear-help-text"
            onClick={onClear}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onClear();
              }
            }}
            disabled={loading}
            className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors min-w-[180px]"
          >
            Clear Stored Keypair
          </button>
        )}
      </div>

      {/* Hidden help text for screen readers */}
      <div className="sr-only">
        <div id="generate-help-text">
          Generates a new Ed25519 cryptographic keypair using the Web Crypto API. The private key
          will be stored securely in your browser's local storage.
        </div>
        <div id="copy-help-text">
          Copies your public key to the system clipboard so you can share it with others. Your
          private key is never copied or exposed.
        </div>
        <div id="clear-help-text">
          Permanently removes your keypair from browser storage. This action cannot be undone and
          you will need to generate a new keypair.
        </div>
      </div>
    </div>
  );
};

export default KeyViewer;
