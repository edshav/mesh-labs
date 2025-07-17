/**
 * Crypto utilities for Ed25519 key operations using Web Crypto API
 */

// TypeScript interfaces for key data structures
export interface KeyPairData {
  publicKey: string; // Base64 encoded
  privateKey: string; // Base64 encoded
}

export interface StoredKeyPair {
  publicKey: string; // Base64 encoded
  privateKey: string; // Base64 encoded
  algorithm: 'Ed25519';
  created: number; // Timestamp
}

// Error types for better error handling
export class CryptoError extends Error {
  constructor(message: string, public readonly cause?: Error) {
    super(message);
    this.name = 'CryptoError';
  }
}

export class UnsupportedBrowserError extends CryptoError {
  constructor(
    message: string = 'Your browser does not support the required cryptographic features'
  ) {
    super(message);
    this.name = 'UnsupportedBrowserError';
  }
}

export class KeyGenerationError extends CryptoError {
  constructor(message: string = 'Failed to generate cryptographic keys') {
    super(message);
    this.name = 'KeyGenerationError';
  }
}

export class KeyImportExportError extends CryptoError {
  constructor(message: string = 'Failed to import or export cryptographic keys') {
    super(message);
    this.name = 'KeyImportExportError';
  }
}

/**
 * Generate a new Ed25519 keypair using Web Crypto API
 * @returns Promise<CryptoKeyPair> - Generated keypair
 * @throws UnsupportedBrowserError if Web Crypto API or Ed25519 is not supported
 * @throws KeyGenerationError if key generation fails
 */
export async function generateKeyPair(): Promise<CryptoKeyPair> {
  // Check if Web Crypto API is supported
  if (!isWebCryptoSupported()) {
    throw new UnsupportedBrowserError(
      'Web Crypto API is not supported in this browser. Please use a modern browser like Chrome, Firefox, or Safari.'
    );
  }

  try {
    const keyPair = await crypto.subtle.generateKey(
      {
        name: 'Ed25519',
      },
      true, // extractable
      ['sign', 'verify']
    );

    // Ed25519 always returns a CryptoKeyPair, but TypeScript doesn't know this
    if (
      !keyPair ||
      typeof keyPair !== 'object' ||
      !('publicKey' in keyPair) ||
      !('privateKey' in keyPair)
    ) {
      throw new KeyGenerationError('Generated key is not a valid keypair');
    }

    return keyPair as CryptoKeyPair;
  } catch (error) {
    if (error instanceof CryptoError) {
      throw error;
    }

    // Handle specific Web Crypto API errors
    if (error instanceof Error) {
      if (error.name === 'NotSupportedError' || error.message.includes('Ed25519')) {
        throw new UnsupportedBrowserError(
          'Ed25519 algorithm is not supported in this browser. Please use a browser that supports Ed25519 cryptography.'
        );
      }
      throw new KeyGenerationError(`Unable to generate keypair: ${error.message}`);
    }

    throw new KeyGenerationError('An unexpected error occurred during key generation');
  }
}

/**
 * Encode ArrayBuffer to Base64 string
 * @param buffer - ArrayBuffer to encode
 * @returns string - Base64 encoded string
 */
export function encodeKey(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

/**
 * Decode Base64 string to ArrayBuffer
 * @param encodedKey - Base64 encoded string
 * @returns ArrayBuffer - Decoded buffer
 * @throws CryptoError if decoding fails
 */
export function decodeKey(encodedKey: string): ArrayBuffer {
  if (!encodedKey || typeof encodedKey !== 'string') {
    throw new CryptoError('Invalid input: encoded key must be a non-empty string');
  }

  try {
    const binary = atob(encodedKey);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes.buffer;
  } catch (error) {
    throw new CryptoError(
      `Failed to decode Base64 key: ${
        error instanceof Error ? error.message : 'Invalid Base64 format'
      }`
    );
  }
}
/**
 * Export a CryptoKeyPair to Base64 encoded strings for storage
 * @param keyPair - CryptoKeyPair to export
 * @returns Promise<KeyPairData> - Object with Base64 encoded keys
 * @throws KeyImportExportError if export fails
 */
export async function exportKeyPair(keyPair: CryptoKeyPair): Promise<KeyPairData> {
  if (!keyPair || !keyPair.publicKey || !keyPair.privateKey) {
    throw new KeyImportExportError('Invalid keypair: missing public or private key');
  }

  if (!isWebCryptoSupported()) {
    throw new UnsupportedBrowserError(
      'Web Crypto API is not supported in this browser. Cannot export keys.'
    );
  }

  try {
    // Export public key
    const publicKeyBuffer = await crypto.subtle.exportKey('spki', keyPair.publicKey);
    const publicKeyBase64 = encodeKey(publicKeyBuffer);

    // Export private key
    const privateKeyBuffer = await crypto.subtle.exportKey('pkcs8', keyPair.privateKey);
    const privateKeyBase64 = encodeKey(privateKeyBuffer);

    return {
      publicKey: publicKeyBase64,
      privateKey: privateKeyBase64,
    };
  } catch (error) {
    if (error instanceof CryptoError) {
      throw error;
    }

    if (error instanceof Error) {
      if (error.name === 'NotSupportedError') {
        throw new UnsupportedBrowserError(
          'Key export is not supported in this browser or the keys are not exportable'
        );
      }
      throw new KeyImportExportError(`Unable to export keypair: ${error.message}`);
    }

    throw new KeyImportExportError('An unexpected error occurred during key export');
  }
}

/**
 * Import Base64 encoded keys back to CryptoKeyPair
 * @param keyData - Object with Base64 encoded keys
 * @returns Promise<CryptoKeyPair> - Imported keypair
 * @throws KeyImportExportError if import fails
 */
export async function importKeyPair(keyData: KeyPairData): Promise<CryptoKeyPair> {
  if (!keyData || !keyData.publicKey || !keyData.privateKey) {
    throw new KeyImportExportError('Invalid key data: missing public or private key');
  }

  if (!isWebCryptoSupported()) {
    throw new UnsupportedBrowserError(
      'Web Crypto API is not supported in this browser. Cannot import keys.'
    );
  }

  try {
    // Import public key
    const publicKeyBuffer = decodeKey(keyData.publicKey);
    const publicKey = await crypto.subtle.importKey(
      'spki',
      publicKeyBuffer,
      {
        name: 'Ed25519',
      },
      true,
      ['verify']
    );

    // Import private key
    const privateKeyBuffer = decodeKey(keyData.privateKey);
    const privateKey = await crypto.subtle.importKey(
      'pkcs8',
      privateKeyBuffer,
      {
        name: 'Ed25519',
      },
      true,
      ['sign']
    );

    return {
      publicKey,
      privateKey,
    };
  } catch (error) {
    if (error instanceof CryptoError) {
      throw error;
    }

    if (error instanceof Error) {
      if (error.name === 'NotSupportedError') {
        throw new UnsupportedBrowserError(
          'Ed25519 algorithm is not supported in this browser or key format is invalid'
        );
      }
      if (error.name === 'DataError') {
        throw new KeyImportExportError(
          'Invalid key format: the provided keys are corrupted or in an unsupported format'
        );
      }
      throw new KeyImportExportError(`Unable to import keypair: ${error.message}`);
    }

    throw new KeyImportExportError('An unexpected error occurred during key import');
  }
}

/**
 * Check if Web Crypto API and Ed25519 are supported
 * @returns boolean - True if supported, false otherwise
 */
export function isWebCryptoSupported(): boolean {
  return (
    typeof crypto !== 'undefined' &&
    typeof crypto.subtle !== 'undefined' &&
    typeof crypto.subtle.generateKey === 'function'
  );
}

/**
 * Check if Ed25519 algorithm is supported by testing key generation
 * @returns Promise<boolean> - True if Ed25519 is supported
 */
export async function isEd25519Supported(): Promise<boolean> {
  try {
    await crypto.subtle.generateKey({ name: 'Ed25519' }, false, ['sign', 'verify']);
    return true;
  } catch {
    return false;
  }
}
