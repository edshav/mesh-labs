import { describe, it, expect } from 'vitest';
import {
  performSecureMemoryClearing,
  generateSecureRandomString,
  secureStringOverwrite,
} from '../security';

describe('Security Utilities', () => {
  describe('performSecureMemoryClearing', () => {
    it('should complete without throwing errors', async () => {
      await expect(performSecureMemoryClearing()).resolves.toBeUndefined();
    });

    it('should complete within reasonable time', async () => {
      const startTime = Date.now();
      await performSecureMemoryClearing();
      const endTime = Date.now();

      // Should complete within 2 seconds (includes 50ms delay + processing time)
      expect(endTime - startTime).toBeLessThan(2000);
    });
  });

  describe('generateSecureRandomString', () => {
    it('should generate string of specified length', () => {
      const result = generateSecureRandomString(32);
      expect(result).toHaveLength(32);
    });

    it('should generate strings with valid characters', () => {
      const result = generateSecureRandomString(50);
      expect(result).toMatch(/^[A-Za-z0-9+/=]+$/);
    });

    it('should generate different strings on multiple calls', () => {
      const result1 = generateSecureRandomString(20);
      const result2 = generateSecureRandomString(20);
      expect(result1).not.toBe(result2);
    });

    it('should handle zero length', () => {
      const result = generateSecureRandomString(0);
      expect(result).toBe('');
    });

    it('should handle large lengths', () => {
      const result = generateSecureRandomString(1000);
      expect(result).toHaveLength(1000);
    });
  });

  describe('secureStringOverwrite', () => {
    it('should handle empty string gracefully', () => {
      expect(() => secureStringOverwrite('')).not.toThrow();
    });

    it('should handle null/undefined gracefully', () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect(() => secureStringOverwrite(null as any)).not.toThrow();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect(() => secureStringOverwrite(undefined as any)).not.toThrow();
    });

    it('should attempt to overwrite string content', () => {
      const sensitiveData = 'sensitive-private-key-data';
      expect(() => secureStringOverwrite(sensitiveData)).not.toThrow();
    });

    it('should handle various string lengths', () => {
      expect(() => secureStringOverwrite('short')).not.toThrow();
      expect(() => secureStringOverwrite('a'.repeat(1000))).not.toThrow();
    });
  });

  describe('Integration tests', () => {
    it('should work together in a typical clearing scenario', async () => {
      // Generate some random data
      const randomData = generateSecureRandomString(100);
      expect(randomData).toHaveLength(100);

      // Attempt to overwrite it
      expect(() => secureStringOverwrite(randomData)).not.toThrow();

      // Perform memory clearing
      await expect(performSecureMemoryClearing()).resolves.toBeUndefined();
    });

    it('should handle concurrent operations', async () => {
      const promises = [
        performSecureMemoryClearing(),
        performSecureMemoryClearing(),
        performSecureMemoryClearing(),
      ];

      await expect(Promise.all(promises)).resolves.toEqual([undefined, undefined, undefined]);
    });
  });
});
