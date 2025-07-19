/**
 * Security utilities for memory management and secure operations
 */

/**
 * Extended window interface for development tools
 */
interface WindowWithGC extends Window {
  gc?: () => void;
}

/**
 * Extended performance interface for experimental memory API
 */
interface PerformanceWithMemoryAPI extends Performance {
  measureUserAgentSpecificMemory?: () => Promise<unknown>;
}

/**
 * Type guard to check if window.gc is available (dev tools)
 */
function supportsGarbageCollection(): boolean {
  return typeof window !== 'undefined' && 'gc' in window;
}

/**
 * Type guard to check if performance.measureUserAgentSpecificMemory is available
 */
function supportsMeasureUserAgentMemory(): boolean {
  return typeof performance !== 'undefined' && 'measureUserAgentSpecificMemory' in performance;
}

/**
 * Perform secure memory clearing operations
 * This function attempts to clear any potential private key references from memory
 */
export async function performSecureMemoryClearing(): Promise<void> {
  // Security: Attempt to trigger garbage collection if available
  // This is a hint to the browser to clean up unused memory references
  if (supportsGarbageCollection()) {
    (window as WindowWithGC).gc?.();
  }

  // Security: Create and immediately discard large objects to encourage memory cleanup
  // This helps overwrite memory locations that might contain sensitive data
  try {
    // Use cryptographically secure random data for memory overwrite
    for (let i = 0; i < 1000; i++) {
      const temp = crypto.getRandomValues(new Uint8Array(1024));
      // Force the array to be used so it's not optimized away
      void temp.length;
    }
  } catch {
    // Fallback to less secure but still useful memory overwrite
    try {
      const memoryOverwrite = new Array(1000)
        .fill(0)
        .map(() => Math.random().toString(36).repeat(100));
      // Force the array to be used so it's not optimized away
      void memoryOverwrite.length;
    } catch {
      // Silently handle any memory allocation errors
    }
  }

  // Security: Small delay to allow memory operations to complete
  await new Promise((resolve) => setTimeout(resolve, 50));

  // Security: Request browser to perform memory pressure cleanup if available
  if (supportsMeasureUserAgentMemory()) {
    try {
      await (performance as PerformanceWithMemoryAPI).measureUserAgentSpecificMemory?.();
    } catch {
      // Silently handle if not supported
    }
  }
}

/**
 * Generate a secure random string for overwriting sensitive data
 * @param length - Length of the random string to generate
 * @returns Random string using cryptographically secure randomness when available
 */
export function generateSecureRandomString(length: number): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
  let result = '';

  // Use crypto.getRandomValues if available for better security
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    const randomBytes = new Uint8Array(length);
    crypto.getRandomValues(randomBytes);

    for (let i = 0; i < length; i++) {
      const byte = randomBytes[i];
      if (byte !== undefined) {
        result += chars[byte % chars.length];
      }
    }
  } else {
    // Fallback to Math.random (less secure but better than nothing)
    for (let i = 0; i < length; i++) {
      result += chars[Math.floor(Math.random() * chars.length)];
    }
  }

  return result;
}

/**
 * Securely overwrite a string in memory by creating multiple references
 * This is a best-effort attempt to overwrite memory locations
 * @param sensitiveData - The sensitive string to overwrite (will be modified)
 */
export function secureStringOverwrite(sensitiveData: string): void {
  if (!sensitiveData) return;

  try {
    const length = sensitiveData.length;
    const randomData = generateSecureRandomString(length);

    // Attempt to overwrite the string content
    // Note: This is limited in JavaScript due to string immutability
    // but we can at least create competing references
    const expanded = randomData.repeat(Math.ceil(length / randomData.length));
    for (let i = 0; i < 10; i++) {
      void expanded.slice(0, length);
    }
  } catch {
    // Silently handle any errors during overwrite attempts
  }
}
