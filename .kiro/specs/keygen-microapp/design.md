# Design Document

## Overview

The Keygen Microapp is a single-page React application that provides an educational interface for cryptographic key generation and management. The application uses the Web Crypto API to generate Ed25519 keypairs entirely in the browser, ensuring that private keys never leave the user's device. The design emphasizes security, usability, and educational value while maintaining a clean, intuitive interface.

## Architecture

### High-Level Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   React UI      │    │   Crypto Utils   │    │   Storage       │
│   Components    │◄──►│   (Web Crypto)   │◄──►│   (localStorage)│
└─────────────────┘    └──────────────────┘    └─────────────────┘
        │                        │                        │
        ▼                        ▼                        ▼
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│ - KeyViewer     │    │ - generateKey()  │    │ - Store private │
│ - Generate Btn  │    │ - encodeKey()    │    │ - Load on init  │
│ - Copy Btn      │    │ - decodeKey()    │    │ - Clear keys    │
│ - Clear Btn     │    │ - validateKey()  │    │                 │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

### Technology Stack

- **Frontend Framework**: React 19+ with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **Styling**: Tailwind CSS for utility-first styling
- **Cryptography**: Web Crypto API (SubtleCrypto interface)
- **Storage**: Browser localStorage for key persistence
- **Key Algorithm**: Ed25519 (EdDSA signature algorithm)

## Components and Interfaces

### Core Components

#### 1. App Component (`App.tsx`)

- **Purpose**: Root component that manages application state and orchestrates key operations
- **State Management**:
  - `keypair: CryptoKeyPair | null` - Current keypair state
  - `publicKeyBase64: string | null` - Base64 encoded public key for display
  - `loading: boolean` - Loading state for async operations
  - `error: string | null` - Error state for user feedback

#### 2. KeyViewer Component (`KeyViewer.tsx`)

- **Purpose**: Displays public key information and provides key management actions
- **Props Interface**:

```typescript
interface KeyViewerProps {
  publicKey: string | null;
  onGenerate: () => Promise<void>;
  onCopy: () => Promise<void>;
  onClear: () => Promise<void>;
  loading: boolean;
  error: string | null;
}
```

### Utility Modules

#### 1. Crypto Utilities (`utils/crypto.ts`)

```typescript
interface KeyPairData {
  publicKey: string;
  privateKey: string;
}

interface CryptoUtils {
  generateKeyPair(): Promise<CryptoKeyPair>;
  exportKeyPair(keyPair: CryptoKeyPair): Promise<KeyPairData>;
  importKeyPair(keyData: KeyPairData): Promise<CryptoKeyPair>;
  encodeKey(key: ArrayBuffer): string;
  decodeKey(encodedKey: string): ArrayBuffer;
}
```

#### 2. Storage Utilities (`utils/storage.ts`)

```typescript
interface StorageUtils {
  saveKeyPair(keyData: KeyPairData): void;
  loadKeyPair(): KeyPairData | null;
  clearKeyPair(): void;
  isKeyPairStored(): boolean;
}
```

## Data Models

### KeyPair Data Structure

```typescript
// Runtime keypair (Web Crypto API)
interface CryptoKeyPair {
  publicKey: CryptoKey;
  privateKey: CryptoKey;
}

// Serializable keypair for storage
interface StoredKeyPair {
  publicKey: string; // Base64 encoded
  privateKey: string; // Base64 encoded
  algorithm: 'Ed25519';
  created: number; // Timestamp
}

// Application state
interface AppState {
  keypair: CryptoKeyPair | null;
  publicKeyDisplay: string | null;
  isLoading: boolean;
  error: string | null;
}
```

### Ed25519 Key Specifications

- **Algorithm**: Ed25519 (EdDSA)
- **Key Size**: 32 bytes (256 bits) for both public and private keys
- **Encoding**: Base64 for storage and display
- **Usage**: Digital signatures (sign/verify operations)

## Error Handling

### Error Categories

1. **Crypto API Errors**

   - Unsupported algorithm
   - Key generation failures
   - Import/export errors

2. **Storage Errors**

   - localStorage unavailable
   - Quota exceeded
   - Data corruption

3. **User Interface Errors**
   - Clipboard access denied
   - Invalid user actions

### Error Handling Strategy

```typescript
interface ErrorHandler {
  handleCryptoError(error: Error): string;
  handleStorageError(error: Error): string;
  handleClipboardError(error: Error): string;
  displayError(message: string): void;
  clearError(): void;
}
```

### User-Friendly Error Messages

- **Key Generation Failed**: "Unable to generate keypair. Please try again."
- **Storage Unavailable**: "Cannot save keys. Local storage may be disabled."
- **Copy Failed**: "Unable to copy to clipboard. Please copy manually."
- **Load Failed**: "Could not restore saved keys. They may be corrupted."

## Testing Strategy

### Unit Testing

1. **Crypto Utilities Testing**

   - Key generation functionality
   - Base64 encoding/decoding
   - Key import/export operations
   - Error handling for unsupported browsers

2. **Storage Utilities Testing**

   - Save/load operations
   - Data integrity validation
   - Clear operations
   - localStorage availability checks

3. **Component Testing**
   - User interaction flows
   - State management
   - Error display
   - Loading states

### Integration Testing

1. **End-to-End Key Lifecycle**

   - Generate → Display → Copy → Clear workflow
   - Persistence across browser sessions
   - Error recovery scenarios

2. **Browser Compatibility**
   - Web Crypto API support validation
   - localStorage functionality
   - Clipboard API availability

### Security Testing

1. **Key Security Validation**

   - Private key never exposed in DOM
   - No network transmission of private keys
   - Proper key clearing from memory
   - localStorage isolation

2. **Input Validation**
   - Malformed stored data handling
   - Invalid key format detection
   - Sanitization of error messages

## Security Considerations

### Private Key Protection

1. **Storage Security**

   - Private keys stored only in localStorage
   - No transmission over network
   - Clear keys on user request
   - No logging of sensitive data

2. **Memory Management**

   - Use Web Crypto API's non-extractable keys when possible
   - Clear sensitive variables after use
   - Avoid string concatenation with private keys

3. **UI Security**
   - Never display private keys
   - Mask or hide sensitive operations
   - Provide clear security warnings

### Browser Security

1. **Same-Origin Policy**

   - Keys isolated to application domain
   - No cross-origin key sharing
   - localStorage scoped to origin

2. **HTTPS Requirement**
   - Web Crypto API requires secure context
   - Recommend HTTPS deployment
   - Warn users about HTTP limitations

## Performance Considerations

### Key Generation Performance

- Ed25519 key generation is typically fast (< 100ms)
- Use async/await to prevent UI blocking
- Show loading indicators for user feedback
- Cache generated keys to avoid regeneration

### Storage Performance

- localStorage operations are synchronous but fast
- Minimize storage operations
- Use efficient Base64 encoding
- Implement lazy loading for stored keys

### UI Performance

- React component optimization
- Minimize re-renders during key operations
- Use React.memo for stable components
- Debounce user interactions if needed
