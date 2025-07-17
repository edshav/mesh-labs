/**
 * Storage utilities for keypair persistence using localStorage
 */

import type { KeyPairData, StoredKeyPair } from './crypto';

// Storage key for localStorage
const STORAGE_KEY = 'keypair';

// Error types for storage operations
export class StorageError extends Error {
  public readonly cause?: Error;

  constructor(message: string, cause?: Error) {
    super(message);
    this.name = 'StorageError';
    this.cause = cause;
  }
}

export class StorageUnavailableError extends StorageError {
  constructor(message: string = 'Local storage is not available in this browser') {
    super(message);
    this.name = 'StorageUnavailableError';
  }
}

export class DataIntegrityError extends StorageError {
  constructor(message: string = 'Stored data is corrupted or invalid') {
    super(message);
    this.name = 'DataIntegrityError';
  }
}

/**
 * Check if localStorage is available and functional
 * @returns boolean - True if localStorage is available
 */
export function isLocalStorageAvailable(): boolean {
  try {
    if (typeof localStorage === 'undefined') {
      return false;
    }

    // Test localStorage functionality
    const testKey = '__storage_test__';
    localStorage.setItem(testKey, 'test');
    localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}

/**
 * Save a keypair to localStorage
 * @param keyData - KeyPairData to store
 * @throws StorageUnavailableError if localStorage is not available
 * @throws StorageError if saving fails
 */
export function saveKeyPair(keyData: KeyPairData): void {
  if (!isLocalStorageAvailable()) {
    throw new StorageUnavailableError(
      'Cannot save keypair: Local storage is not available. This may be due to private browsing mode or browser settings.'
    );
  }

  if (!keyData || !keyData.publicKey || !keyData.privateKey) {
    throw new StorageError('Invalid key data: missing public or private key');
  }

  try {
    const storedKeyPair: StoredKeyPair = {
      publicKey: keyData.publicKey,
      privateKey: keyData.privateKey,
      algorithm: 'Ed25519',
      created: Date.now(),
    };

    const serializedData = JSON.stringify(storedKeyPair);
    localStorage.setItem(STORAGE_KEY, serializedData);
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === 'QuotaExceededError') {
        throw new StorageError(
          'Cannot save keypair: Storage quota exceeded. Please clear some browser data and try again.'
        );
      }
      throw new StorageError(`Failed to save keypair: ${error.message}`, error);
    }
    throw new StorageError('An unexpected error occurred while saving the keypair');
  }
}

/**
 * Load a keypair from localStorage
 * @returns KeyPairData | null - Loaded keypair data or null if not found
 * @throws StorageUnavailableError if localStorage is not available
 * @throws DataIntegrityError if stored data is corrupted
 */
export function loadKeyPair(): KeyPairData | null {
  if (!isLocalStorageAvailable()) {
    throw new StorageUnavailableError('Cannot load keypair: Local storage is not available.');
  }

  try {
    const serializedData = localStorage.getItem(STORAGE_KEY);

    if (!serializedData) {
      return null;
    }

    const storedKeyPair: StoredKeyPair = JSON.parse(serializedData);

    // Validate the stored data structure
    if (!validateStoredKeyPair(storedKeyPair)) {
      throw new DataIntegrityError('Stored keypair data is corrupted or in an invalid format');
    }

    return {
      publicKey: storedKeyPair.publicKey,
      privateKey: storedKeyPair.privateKey,
    };
  } catch (error) {
    if (error instanceof StorageError) {
      throw error;
    }

    if (error instanceof SyntaxError) {
      throw new DataIntegrityError('Stored keypair data is corrupted: invalid JSON format');
    }

    if (error instanceof Error) {
      throw new StorageError(`Failed to load keypair: ${error.message}`, error);
    }

    throw new StorageError('An unexpected error occurred while loading the keypair');
  }
}

/**
 * Clear stored keypair from localStorage
 * @throws StorageUnavailableError if localStorage is not available
 * @throws StorageError if clearing fails
 */
export function clearKeyPair(): void {
  if (!isLocalStorageAvailable()) {
    throw new StorageUnavailableError('Cannot clear keypair: Local storage is not available.');
  }

  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    if (error instanceof Error) {
      throw new StorageError(`Failed to clear keypair: ${error.message}`, error);
    }
    throw new StorageError('An unexpected error occurred while clearing the keypair');
  }
}

/**
 * Check if a keypair is stored in localStorage
 * @returns boolean - True if a keypair is stored
 */
export function isKeyPairStored(): boolean {
  if (!isLocalStorageAvailable()) {
    return false;
  }

  try {
    const serializedData = localStorage.getItem(STORAGE_KEY);
    return serializedData !== null;
  } catch {
    return false;
  }
}

/**
 * Validate the structure of stored keypair data
 * @param data - Data to validate
 * @returns boolean - True if data is valid
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function validateStoredKeyPair(data: any): data is StoredKeyPair {
  return (
    data &&
    typeof data === 'object' &&
    typeof data.publicKey === 'string' &&
    typeof data.privateKey === 'string' &&
    data.algorithm === 'Ed25519' &&
    typeof data.created === 'number' &&
    data.publicKey.length > 0 &&
    data.privateKey.length > 0 &&
    data.created > 0
  );
}
