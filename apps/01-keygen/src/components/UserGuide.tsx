import React from 'react';

interface UserGuideProps {
  className?: string;
}

/**
 * Comprehensive user guide component explaining how to use the Ed25519 Key Generator
 */
export const UserGuide: React.FC<UserGuideProps> = ({ className = '' }) => {
  return (
    <div className={`bg-white rounded-lg border border-gray-200 p-6 ${className}`}>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center">
          <svg
            className="w-6 h-6 mr-2 text-blue-600"
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
          Complete User Guide
        </h2>
        <p className="text-gray-600">
          Everything you need to know about using the Ed25519 Key Generator safely and effectively.
        </p>
      </div>

      <div className="space-y-8">
        {/* Getting Started */}
        <section>
          <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <span className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm mr-3">
              1
            </span>
            Getting Started
          </h3>
          <div className="ml-11 space-y-3">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 mb-2">🚀 First Time Setup</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• No installation required - works directly in your browser</li>
                <li>• Ensure you're using a modern browser (Chrome, Firefox, Safari, Edge)</li>
                <li>• For best security, use HTTPS (this app works on HTTP for development)</li>
                <li>• Consider using a private/incognito window for sensitive operations</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Key Generation */}
        <section>
          <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <span className="bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm mr-3">
              2
            </span>
            Generating Your First Keypair
          </h3>
          <div className="ml-11 space-y-3">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h4 className="font-medium text-green-900 mb-2">🔑 Key Generation Process</h4>
              <ol className="text-sm text-green-800 space-y-2">
                <li>
                  <strong>1.</strong> Click the "Generate Keypair" button
                </li>
                <li>
                  <strong>2.</strong> Wait for the generation process (usually &lt; 1 second)
                </li>
                <li>
                  <strong>3.</strong> Your public key will appear in Base64 format
                </li>
                <li>
                  <strong>4.</strong> Your private key is automatically stored securely in browser
                  storage
                </li>
                <li>
                  <strong>5.</strong> The keypair is ready for use immediately
                </li>
              </ol>
            </div>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <p className="text-sm text-yellow-800">
                <strong>💡 Tip:</strong> Each keypair is unique and cryptographically secure. You
                can generate multiple keypairs, but only one is stored at a time in this
                application.
              </p>
            </div>
          </div>
        </section>

        {/* Understanding Your Keys */}
        <section>
          <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <span className="bg-purple-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm mr-3">
              3
            </span>
            Understanding Your Keys
          </h3>
          <div className="ml-11 space-y-3">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <h4 className="font-medium text-purple-900 mb-2 flex items-center">
                  🔓 Public Key
                </h4>
                <ul className="text-sm text-purple-800 space-y-1">
                  <li>• Safe to share with anyone</li>
                  <li>• Used to verify your digital signatures</li>
                  <li>• Can encrypt messages only you can read</li>
                  <li>• 32 bytes (256 bits) of data</li>
                  <li>• Displayed in Base64 format (44 characters)</li>
                </ul>
              </div>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h4 className="font-medium text-red-900 mb-2 flex items-center">🔒 Private Key</h4>
                <ul className="text-sm text-red-800 space-y-1">
                  <li>• Must NEVER be shared</li>
                  <li>• Used to create digital signatures</li>
                  <li>• Can decrypt messages sent to your public key</li>
                  <li>• Stored securely in browser localStorage</li>
                  <li>• Never displayed in the interface</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Using Your Keys */}
        <section>
          <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <span className="bg-orange-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm mr-3">
              4
            </span>
            Using Your Keys
          </h3>
          <div className="ml-11 space-y-3">
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <h4 className="font-medium text-orange-900 mb-2">📋 Copying Your Public Key</h4>
              <ol className="text-sm text-orange-800 space-y-1">
                <li>1. Click the "Copy to Clipboard" button</li>
                <li>2. Look for the success message confirmation</li>
                <li>3. Paste the key wherever you need it (Ctrl+V or Cmd+V)</li>
                <li>4. The copied key is in Base64 format, ready for most applications</li>
              </ol>
            </div>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">🔄 Persistent Storage</h4>
              <p className="text-sm text-gray-700 mb-2">
                Your keypair is automatically saved to your browser's localStorage:
              </p>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Keys persist between browser sessions</li>
                <li>• Only accessible from this specific website</li>
                <li>• Automatically loaded when you return to the page</li>
                <li>• Isolated from other websites and applications</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Security Best Practices */}
        <section>
          <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <span className="bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm mr-3">
              5
            </span>
            Security Best Practices
          </h3>
          <div className="ml-11 space-y-3">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h4 className="font-medium text-red-900 mb-2">🛡️ Essential Security Rules</h4>
              <div className="space-y-3">
                <div>
                  <h5 className="font-medium text-red-800">Private Key Protection:</h5>
                  <ul className="text-sm text-red-700 mt-1 space-y-1">
                    <li>• Never share your private key with anyone</li>
                    <li>• Don't copy or paste private keys (this app doesn't show them)</li>
                    <li>• Clear keys when using shared computers</li>
                    <li>• Be aware that localStorage is not encrypted</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-medium text-red-800">Browser Security:</h5>
                  <ul className="text-sm text-red-700 mt-1 space-y-1">
                    <li>• Keep your browser updated</li>
                    <li>• Use HTTPS when possible</li>
                    <li>• Be cautious of browser extensions</li>
                    <li>• Consider using private browsing mode</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Clearing Keys */}
        <section>
          <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <span className="bg-gray-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm mr-3">
              6
            </span>
            Clearing Your Keys
          </h3>
          <div className="ml-11 space-y-3">
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">🗑️ When to Clear Keys</h4>
              <ul className="text-sm text-gray-700 space-y-1 mb-3">
                <li>• When using a shared or public computer</li>
                <li>• Before generating a new keypair</li>
                <li>• When you no longer need the keys</li>
                <li>• For security hygiene (regular cleanup)</li>
              </ul>
              <div className="bg-yellow-100 border border-yellow-300 rounded p-3">
                <p className="text-sm text-yellow-800">
                  <strong>⚠️ Warning:</strong> Clearing keys is permanent. Make sure you've backed
                  up any important keys before clearing them. This action cannot be undone.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Troubleshooting */}
        <section>
          <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <span className="bg-indigo-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm mr-3">
              7
            </span>
            Troubleshooting
          </h3>
          <div className="ml-11 space-y-3">
            <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
              <h4 className="font-medium text-indigo-900 mb-2">🔧 Common Issues</h4>
              <div className="space-y-3 text-sm">
                <div>
                  <h5 className="font-medium text-indigo-800">Key generation fails:</h5>
                  <ul className="text-indigo-700 mt-1 space-y-1">
                    <li>• Check if your browser supports the Web Crypto API</li>
                    <li>• Try refreshing the page</li>
                    <li>• Ensure JavaScript is enabled</li>
                    <li>• Try a different browser</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-medium text-indigo-800">Copy to clipboard doesn't work:</h5>
                  <ul className="text-indigo-700 mt-1 space-y-1">
                    <li>• Check browser permissions for clipboard access</li>
                    <li>• Try manually selecting and copying the key</li>
                    <li>• Some browsers require user interaction first</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-medium text-indigo-800">Keys don't persist:</h5>
                  <ul className="text-indigo-700 mt-1 space-y-1">
                    <li>• Check if localStorage is enabled</li>
                    <li>• Ensure you're not in private browsing mode</li>
                    <li>• Check browser storage settings</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Educational Resources */}
        <section>
          <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <span className="bg-teal-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm mr-3">
              8
            </span>
            Learn More
          </h3>
          <div className="ml-11 space-y-3">
            <div className="bg-teal-50 border border-teal-200 rounded-lg p-4">
              <h4 className="font-medium text-teal-900 mb-2">📚 Additional Resources</h4>
              <div className="space-y-2 text-sm text-teal-800">
                <p>
                  <strong>Ed25519 Algorithm:</strong> Learn about the mathematics and security
                  properties
                </p>
                <p>
                  <strong>Web Crypto API:</strong> Explore browser-based cryptographic capabilities
                </p>
                <p>
                  <strong>Digital Signatures:</strong> Understand how public key cryptography
                  enables authentication
                </p>
                <p>
                  <strong>Key Management:</strong> Best practices for handling cryptographic keys
                </p>
              </div>
              <div className="mt-3 p-3 bg-teal-100 rounded">
                <p className="text-sm text-teal-800">
                  <strong>💡 Next Steps:</strong> Try using your generated keys with other
                  cryptographic tools or applications that support Ed25519. Many modern systems
                  accept keys in the Base64 format this application provides.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>

      <div className="mt-8 pt-6 border-t border-gray-200">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-medium text-blue-900 mb-2">🎓 Educational Purpose</h4>
          <p className="text-sm text-blue-800">
            This application is designed for educational purposes to help you understand
            cryptographic key generation and management. While it uses secure, industry-standard
            algorithms, consider additional security measures for production use cases.
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserGuide;
