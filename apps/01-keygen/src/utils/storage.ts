/**
 * Storage utilities for keypair persistence using localStorage
 */

import type { KeyPairData, StoredKeyPair } from './crypto';
import { generateSecureRandomString } from './security';

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
 * Clear stored keypair from localStorage with enhanced security measures
 * @throws StorageUnavailableError if localStorage is not available
 * @throws StorageError if clearing fails
 */
export function clearKeyPair(): void {
  if (!isLocalStorageAvailable()) {
    throw new StorageUnavailableError('Cannot clear keypair: Local storage is not available.');
  }

  try {
    // First, verify if a keypair exists before clearing
    const existingData = localStorage.getItem(STORAGE_KEY);
    const hadKeypair = existingData !== null;

    // Security: Overwrite the storage location with random data before removal
    // This helps prevent potential data recovery from browser storage
    if (hadKeypair) {
      // Generate random data of similar size to overwrite the storage location
      const randomData = generateSecureRandomString(existingData.length);
      localStorage.setItem(STORAGE_KEY, randomData);

      // Immediately remove after overwriting
      localStorage.removeItem(STORAGE_KEY);
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }

    // Security audit logging (without exposing sensitive data)
    logSecurityEvent('keypair_cleared', {
      timestamp: Date.now(),
      hadExistingKeypair: hadKeypair,
      userAgent:
        typeof navigator !== 'undefined' && navigator.userAgent
          ? navigator.userAgent.substring(0, 50)
          : 'unknown',
    });

    // Verify complete removal
    const verificationData = localStorage.getItem(STORAGE_KEY);
    if (verificationData !== null) {
      // If data still exists, try one more removal attempt
      localStorage.removeItem(STORAGE_KEY);
      const finalVerification = localStorage.getItem(STORAGE_KEY);
      if (finalVerification !== null) {
        throw new StorageError('Failed to completely remove keypair from storage');
      }
    }
  } catch (error) {
    if (error instanceof StorageError) {
      throw error;
    }
    if (error instanceof Error) {
      throw new StorageError(`Failed to clear keypair: ${error.message}`, error);
    }
    throw new StorageError('An unexpected error occurred while clearing the keypair');
  }
}

/**
 * Log security events for audit purposes (without exposing sensitive data)
 * @param event - Type of security event
 * @param metadata - Non-sensitive metadata about the event
 */
function logSecurityEvent(event: string, metadata: Record<string, unknown>): void {
  try {
    // Only log in development or when explicitly enabled
    const shouldLog =
      import.meta.env.DEV ||
      (typeof window !== 'undefined' &&
        window.localStorage.getItem('keygen_security_logging') === 'enabled');

    if (shouldLog) {
      console.log(`[SECURITY AUDIT] ${event}:`, {
        ...metadata,
        // Never log actual key data
        note: 'This log contains no sensitive cryptographic material',
      });
    }

    // Store security events in a separate localStorage key for audit trail
    const auditKey = 'keygen_security_audit';
    const existingAudit = localStorage.getItem(auditKey);
    let auditLog = [];

    try {
      auditLog = existingAudit ? JSON.parse(existingAudit) : [];
    } catch {
      // If audit log is corrupted, start fresh
      auditLog = [];
    }

    auditLog.push({
      event,
      timestamp: Date.now(),
      metadata: {
        ...metadata,
        // Sanitize any potentially sensitive data
        userAgent:
          typeof metadata.userAgent === 'string' && metadata.userAgent
            ? metadata.userAgent.substring(0, 50)
            : undefined,
      },
    });

    // Keep only the last 50 audit entries to prevent storage bloat
    if (auditLog.length > 50) {
      auditLog.splice(0, auditLog.length - 50);
    }

    localStorage.setItem(auditKey, JSON.stringify(auditLog));
  } catch (error) {
    // Silently fail logging to not interfere with main functionality
    console.warn('Failed to log security event:', error);
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
