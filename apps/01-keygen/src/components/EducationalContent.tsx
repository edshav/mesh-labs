import { useState, memo, useCallback } from 'react';

interface EducationalContentProps {
  className?: string;
}

/**
 * Educational content component that provides information about Ed25519, Web Crypto API,
 * and security best practices
 * Memoized to prevent unnecessary re-renders
 */
export const EducationalContent = memo<EducationalContentProps>(function EducationalContent({
  className = '',
}) {
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const toggleSection = useCallback((section: string) => {
    setActiveSection((prev) => (prev === section ? null : section));
  }, []);

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
        <h2 className="text-lg font-semibold text-blue-900 mb-3 flex items-center">
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
            />
          </svg>
          Learn About Cryptography
        </h2>

        {/* Ed25519 Section */}
        <div className="mb-4">
          <button
            onClick={() => toggleSection('ed25519')}
            className="w-full text-left p-3 bg-white rounded-lg border border-blue-200 hover:bg-blue-50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-expanded={activeSection === 'ed25519'}
          >
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-blue-800">What is Ed25519?</h3>
              <svg
                className={`w-5 h-5 text-blue-600 transform transition-transform duration-200 ${
                  activeSection === 'ed25519' ? 'rotate-180' : ''
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </button>

          {activeSection === 'ed25519' && (
            <div className="mt-3 p-4 bg-white rounded-lg border border-blue-100">
              <div className="space-y-3 text-sm text-gray-700">
                <p>
                  <strong>Ed25519</strong> is a modern elliptic curve digital signature algorithm
                  that provides:
                </p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>
                    <strong>High Security:</strong> 128-bit security level, equivalent to 3072-bit
                    RSA
                  </li>
                  <li>
                    <strong>Fast Performance:</strong> Optimized for speed in both signing and
                    verification
                  </li>
                  <li>
                    <strong>Small Keys:</strong> Only 32 bytes for both public and private keys
                  </li>
                  <li>
                    <strong>Deterministic:</strong> Same message always produces the same signature
                  </li>
                  <li>
                    <strong>Side-channel Resistant:</strong> Designed to resist timing attacks
                  </li>
                </ul>
                <div className="bg-blue-50 p-3 rounded border-l-4 border-blue-400">
                  <p className="text-blue-800">
                    <strong>Why Ed25519?</strong> It's widely adopted by modern systems like SSH,
                    TLS 1.3, and cryptocurrency networks because of its excellent
                    security-to-performance ratio.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Web Crypto API Section */}
        <div className="mb-4">
          <button
            onClick={() => toggleSection('webcrypto')}
            className="w-full text-left p-3 bg-white rounded-lg border border-blue-200 hover:bg-blue-50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-expanded={activeSection === 'webcrypto'}
          >
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-blue-800">What is the Web Crypto API?</h3>
              <svg
                className={`w-5 h-5 text-blue-600 transform transition-transform duration-200 ${
                  activeSection === 'webcrypto' ? 'rotate-180' : ''
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </button>

          {activeSection === 'webcrypto' && (
            <div className="mt-3 p-4 bg-white rounded-lg border border-blue-100">
              <div className="space-y-3 text-sm text-gray-700">
                <p>
                  The <strong>Web Crypto API</strong> is a browser standard that provides
                  cryptographic operations directly in JavaScript:
                </p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>
                    <strong>Native Performance:</strong> Hardware-accelerated cryptographic
                    operations
                  </li>
                  <li>
                    <strong>Secure Context:</strong> Only works over HTTPS to prevent tampering
                  </li>
                  <li>
                    <strong>Non-extractable Keys:</strong> Private keys can be protected from
                    JavaScript access
                  </li>
                  <li>
                    <strong>Standard Algorithms:</strong> Supports industry-standard cryptographic
                    algorithms
                  </li>
                  <li>
                    <strong>Browser Integration:</strong> Built into modern browsers, no external
                    libraries needed
                  </li>
                </ul>
                <div className="bg-green-50 p-3 rounded border-l-4 border-green-400">
                  <p className="text-green-800">
                    <strong>Security Benefit:</strong> Using the Web Crypto API ensures your
                    cryptographic operations are performed by the browser's secure, audited
                    implementation rather than potentially vulnerable JavaScript libraries.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Security Best Practices Section */}
        <div className="mb-4">
          <button
            onClick={() => toggleSection('security')}
            className="w-full text-left p-3 bg-white rounded-lg border border-blue-200 hover:bg-blue-50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-expanded={activeSection === 'security'}
          >
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-blue-800">Security Best Practices</h3>
              <svg
                className={`w-5 h-5 text-blue-600 transform transition-transform duration-200 ${
                  activeSection === 'security' ? 'rotate-180' : ''
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </button>

          {activeSection === 'security' && (
            <div className="mt-3 p-4 bg-white rounded-lg border border-blue-100">
              <div className="space-y-4 text-sm text-gray-700">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">🔐 Private Key Protection</h4>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Never share your private key with anyone</li>
                    <li>Private keys should never be transmitted over networks</li>
                    <li>Store private keys only in secure, local storage</li>
                    <li>Clear private keys from memory when no longer needed</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">🌐 Browser Security</h4>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Always use HTTPS for cryptographic applications</li>
                    <li>Keep your browser updated for latest security patches</li>
                    <li>Be cautious of browser extensions that might access your data</li>
                    <li>Use incognito/private browsing for sensitive operations</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">💾 Storage Considerations</h4>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>localStorage is not encrypted - only use for non-sensitive data</li>
                    <li>Consider using IndexedDB for more complex key management</li>
                    <li>Regularly backup important keys to secure locations</li>
                    <li>Clear stored keys when switching to shared computers</li>
                  </ul>
                </div>

                <div className="bg-red-50 p-3 rounded border-l-4 border-red-400">
                  <p className="text-red-800">
                    <strong>Important:</strong> This application is for educational purposes. For
                    production use, consider additional security measures like key derivation
                    functions, secure enclaves, or hardware security modules.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User Guide Section */}
        <div>
          <button
            onClick={() => toggleSection('guide')}
            className="w-full text-left p-3 bg-white rounded-lg border border-blue-200 hover:bg-blue-50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-expanded={activeSection === 'guide'}
          >
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-blue-800">How to Use This Application</h3>
              <svg
                className={`w-5 h-5 text-blue-600 transform transition-transform duration-200 ${
                  activeSection === 'guide' ? 'rotate-180' : ''
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </button>

          {activeSection === 'guide' && (
            <div className="mt-3 p-4 bg-white rounded-lg border border-blue-100">
              <div className="space-y-4 text-sm text-gray-700">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                    <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs mr-2">
                      1
                    </span>
                    Generate Your First Keypair
                  </h4>
                  <p className="ml-8">
                    Click the "Generate Keypair" button to create your first Ed25519 keypair. The
                    process happens entirely in your browser and takes just a moment.
                  </p>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                    <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs mr-2">
                      2
                    </span>
                    View Your Public Key
                  </h4>
                  <p className="ml-8">
                    Your public key will be displayed in Base64 format. This key is safe to share
                    and can be used by others to verify signatures you create.
                  </p>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                    <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs mr-2">
                      3
                    </span>
                    Copy and Share
                  </h4>
                  <p className="ml-8">
                    Use the "Copy to Clipboard" button to copy your public key. You can then paste
                    it into other applications or share it with others.
                  </p>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                    <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs mr-2">
                      4
                    </span>
                    Persistent Storage
                  </h4>
                  <p className="ml-8">
                    Your keypair is automatically saved to your browser's local storage. When you
                    return to this page, your keys will be restored automatically.
                  </p>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                    <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs mr-2">
                      5
                    </span>
                    Clear When Done
                  </h4>
                  <p className="ml-8">
                    Use the "Clear Stored Keypair" button to remove your keys from browser storage.
                    This is recommended when using shared computers.
                  </p>
                </div>

                <div className="bg-yellow-50 p-3 rounded border-l-4 border-yellow-400">
                  <p className="text-yellow-800">
                    <strong>Remember:</strong> Your private key never leaves your browser and is
                    never displayed in the interface. Only you have access to it through this
                    application.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

export default EducationalContent;
