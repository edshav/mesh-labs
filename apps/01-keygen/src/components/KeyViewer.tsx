import { memo } from 'react';
import { Tooltip } from './Tooltip';

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
 * Memoized to prevent unnecessary re-renders
 */
export const KeyViewer = memo<KeyViewerProps>(function KeyViewer({
  publicKey,
  onGenerate,
  onCopy,
  onClear,
  loading,
  error,
  copySuccess,
  clearSuccess,
}) {
  return (
    <div className="space-y-4">
      {/* Error display */}
      {error && (
        <div
          className="p-4 sm:p-5 bg-red-50 border border-red-200 rounded-lg shadow-sm"
          role="alert"
          aria-live="assertive"
          aria-atomic="true"
        >
          <div className="flex items-start">
            <svg
              className="w-5 h-5 text-red-600 mr-3 mt-0.5 flex-shrink-0"
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
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <div>
              <p className="text-red-800 font-medium text-sm sm:text-base">Error</p>
              <p className="text-red-700 text-sm mt-1">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Success message display */}
      {copySuccess && (
        <div
          className="p-4 sm:p-5 bg-green-50 border border-green-200 rounded-lg shadow-sm"
          role="status"
          aria-live="polite"
          aria-atomic="true"
        >
          <div className="flex items-start">
            <svg
              className="w-5 h-5 text-green-600 mr-3 mt-0.5 flex-shrink-0"
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
            <div>
              <p className="text-green-800 font-medium text-sm sm:text-base">Success</p>
              <p className="text-green-700 text-sm mt-1">{copySuccess}</p>
            </div>
          </div>
        </div>
      )}

      {/* Clear success message display */}
      {clearSuccess && (
        <div
          className="p-4 sm:p-5 bg-blue-50 border border-blue-200 rounded-lg shadow-sm"
          role="status"
          aria-live="polite"
          aria-atomic="true"
        >
          <div className="flex items-start">
            <svg
              className="w-5 h-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0"
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
            <div>
              <p className="text-blue-800 font-medium text-sm sm:text-base">Cleared</p>
              <p className="text-blue-700 text-sm mt-1">{clearSuccess}</p>
            </div>
          </div>
        </div>
      )}

      {/* Conditional rendering based on key existence */}
      {publicKey ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-700">
              Your{' '}
              <Tooltip
                content={
                  <div>
                    <strong>Public Key:</strong> A cryptographic key that can be shared openly. It's
                    used to verify digital signatures created with your private key, or to encrypt
                    messages that only your private key can decrypt.
                  </div>
                }
                position="bottom"
              >
                <span className="underline decoration-dotted decoration-blue-400 cursor-help">
                  Public Key
                </span>
              </Tooltip>
            </h2>
            <div className="flex items-center text-green-600">
              <svg
                className="w-5 h-5 mr-1"
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
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span className="text-sm font-medium">Secure</span>
            </div>
          </div>

          {/* Public key display with proper formatting */}
          <div
            className="bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-lg p-4 sm:p-6"
            role="region"
            aria-label="Public key display"
          >
            <div
              className="font-mono text-xs sm:text-sm text-gray-800 break-all leading-relaxed select-all"
              aria-label="Your public key in Base64 format"
              tabIndex={0}
            >
              {publicKey}
            </div>
            <div className="mt-2 text-xs text-gray-500 flex items-center">
              <Tooltip
                content={
                  <div>
                    <strong>Base64 Encoding:</strong> A method of encoding binary data into text
                    using 64 printable ASCII characters. This makes the key safe to copy, paste, and
                    transmit in text-based systems.
                  </div>
                }
                position="top"
              >
                <span className="underline decoration-dotted decoration-gray-400 cursor-help">
                  Base64 Format
                </span>
              </Tooltip>
              <span className="mx-2">•</span>
              <span>{publicKey.length} characters</span>
            </div>
          </div>

          {/* Educational note */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4">
            <div className="flex items-start">
              <svg
                className="w-5 h-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0"
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
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <div>
                <p className="text-sm text-blue-800 font-medium mb-1">Security Information</p>
                <div className="text-xs sm:text-sm text-blue-700">
                  This is your public key in Base64 format. It's safe to share this key with others.
                  Your{' '}
                  <Tooltip
                    content={
                      <div>
                        <strong>Private Key:</strong> The secret half of your keypair that must
                        never be shared. It's used to create digital signatures and decrypt messages
                        encrypted with your public key. Loss of your private key means loss of your
                        cryptographic identity.
                      </div>
                    }
                    position="top"
                  >
                    <span className="underline decoration-dotted decoration-blue-400 cursor-help">
                      private key
                    </span>
                  </Tooltip>{' '}
                  is securely stored locally and never displayed or transmitted.
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-8 sm:py-12">
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-dashed border-gray-300 rounded-xl p-6 sm:p-8">
            <div className="text-gray-400 mb-4">
              <svg
                className="mx-auto h-16 w-16 sm:h-20 sm:w-20"
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
            <h3 className="text-lg sm:text-xl font-medium text-gray-700 mb-2">
              No{' '}
              <Tooltip
                content={
                  <div>
                    <strong>Keypair:</strong> A matched set of cryptographic keys consisting of a
                    public key (which can be shared) and a private key (which must be kept secret).
                    Together, they enable secure communication and digital signatures.
                  </div>
                }
                position="top"
              >
                <span className="underline decoration-dotted decoration-gray-400 cursor-help">
                  Keypair
                </span>
              </Tooltip>{' '}
              Available
            </h3>
            <div className="text-gray-500 text-sm sm:text-base max-w-md mx-auto">
              Generate a new{' '}
              <Tooltip
                content={
                  <div>
                    <strong>Ed25519:</strong> A modern elliptic curve digital signature algorithm
                    that provides high security with excellent performance. It's widely used in
                    modern cryptographic systems and produces 32-byte keys.
                  </div>
                }
                position="top"
              >
                <span className="underline decoration-dotted decoration-gray-400 cursor-help">
                  Ed25519
                </span>
              </Tooltip>{' '}
              keypair to get started with cryptographic operations. Your keys will be generated
              securely in your browser using the{' '}
              <Tooltip
                content={
                  <div>
                    <strong>Web Crypto API:</strong> A browser standard that provides secure,
                    hardware-accelerated cryptographic operations. It ensures your keys are
                    generated using the browser's secure, audited cryptographic implementation.
                  </div>
                }
                position="top"
              >
                <span className="underline decoration-dotted decoration-gray-400 cursor-help">
                  Web Crypto API
                </span>
              </Tooltip>
              .
            </div>
          </div>
        </div>
      )}

      {/* Action buttons */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
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
          className="relative px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium text-sm sm:text-base min-h-[48px] flex items-center justify-center"
        >
          {loading ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Generating...
            </>
          ) : (
            <>
              <svg
                className="w-5 h-5 mr-2"
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
                  d="M15 7a2 2 0 012 2m0 0a2 2 0 012 2v6a2 2 0 01-2 2H9a2 2 0 01-2-2V9a2 2 0 012-2m0 0V7a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
              {publicKey ? 'Generate New Keypair' : 'Generate Keypair'}
            </>
          )}
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
            disabled={loading || !publicKey}
            className="relative px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium text-sm sm:text-base min-h-[48px] flex items-center justify-center"
          >
            <svg
              className="w-5 h-5 mr-2"
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
                d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
              />
            </svg>
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
            className="relative px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium text-sm sm:text-base min-h-[48px] flex items-center justify-center"
          >
            <svg
              className="w-5 h-5 mr-2"
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
});

export default KeyViewer;
