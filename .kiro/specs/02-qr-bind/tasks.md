# Implementation Plan

## Phase 1: Foundation & Core Features

- [ ] 1. Extract shared utilities to focused packages

  - Create packages/crypto with Ed25519 operations and message signing/verification
  - Create packages/storage with abstracted storage interface (localStorage implementation)
  - Create packages/security with secure random generation, audit logging, and console audit trail
  - Move and refactor crypto.ts, storage.ts, and security.ts from 01-keygen
  - Design simple storage abstraction layer to avoid tight coupling with localStorage
  - Implement StorageProvider interface with localStorage as the concrete implementation
  - Add README.md, types.ts, and index.ts for clean package interfaces and documentation
  - Set up proper package.json files with exports and TypeScript declarations
  - Write additional unit tests for new signing/verification functions and storage abstraction
  - _Requirements: 1.1, 1.2, 1.3, 4.1, 4.2_

- [ ] 2. Set up QR Linker project structure and tooling

  - Create React + TypeScript project structure in apps/02-qr-bind
  - Install dependencies: packages/crypto, packages/storage, packages/security, qrcode.js, qr-scanner, @types packages
  - Configure Vite build system and TypeScript configuration
  - Set up ESLint + Prettier with consistent rules across monorepo
  - Add Git pre-commit hooks via lint-staged and husky
  - Add basic GitHub Actions workflow for test/lint checks
  - Set up testing framework with Vitest and React Testing Library
  - Update 01-keygen to use shared packages/crypto, packages/storage, packages/security
  - _Requirements: 5.1, 5.2_

- [ ] 3. Create QR-specific data models and interfaces
  - Define SignedMessage, QRCodeData, and VerificationResult TypeScript interfaces
  - Create error classes for QR operations (QRGenerationError, QRScanError, etc.)
  - Implement data validation functions for QR code data structures
  - Write unit tests for data model validation and serialization
  - _Requirements: 2.4, 3.2, 6.2_

### 🔐 Signing & QR Generation Feature Track

- [ ] 4. Build message signing and QR generation utilities

  - Implement generateQRCode function using qrcode.js library
  - Add QR code size validation and capacity checking
  - Create QR data serialization with version compatibility
  - Implement QR code data URL generation for display/download
  - Write unit tests for QR generation with various message sizes
  - _Requirements: 1.1, 1.2, 2.1, 2.2, 2.3, 2.4_

- [ ] 5. Implement useMessageSigning and useQRGeneration hooks

  - Create useMessageSigning hook for managing signing state and operations
  - Create useQRGeneration hook for QR code generation state management
  - Add loading states, error handling, and success feedback
  - Implement message validation before signing
  - Add automatic keypair detection and error prompts
  - Write unit tests for both hooks
  - _Requirements: 1.1, 1.2, 1.4, 1.5, 2.1, 2.2, 2.5_

- [ ] 6. Build MessageSigner and QRGenerator components
  - Create MessageSigner component for message input and signing
  - Create QRGenerator component for QR code display and management
  - Add text area with character limits, sign button with loading states
  - Implement QR code rendering with download functionality
  - Add error display and user-friendly error messages
  - Write component tests for user interactions and workflows
  - _Requirements: 1.1, 1.2, 1.3, 1.5, 2.1, 2.2, 2.5_

### 📷 QR Scanning & Verification Feature Track

- [ ] 7. Create QR code scanning utilities

  - Implement QR scanner using qr-scanner library and camera API
  - Add camera permission handling and error management
  - Create QR data parsing and validation functions
  - Implement manual QR data input as fallback option
  - Write unit tests for scanning utilities with mocked camera
  - _Requirements: 3.1, 3.2, 3.6, 3.7_

- [ ] 8. Implement useQRScanning hook

  - Create hook for camera and scanning state management
  - Add camera permission request and status tracking
  - Implement scanning start/stop controls
  - Add automatic signature verification after scanning
  - Write unit tests for scanning hook with mocked camera API
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_

- [ ] 9. Build QRScanner and verification display components
  - Create QRScanner component for camera-based QR scanning
  - Create component for displaying signature verification results
  - Add camera preview with controls and permission handling
  - Display verification results with clear success/failure indicators
  - Add security warnings and educational content
  - Write component tests for scanning workflow and verification scenarios
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.6, 3.7, 6.1, 6.2, 6.3, 6.4, 6.5_

### 🗝️ Key Management Feature Track

- [ ] 10. Build KeypairManager component
  - Create React component for keypair status and management using shared packages
  - Display current public key and keypair status information
  - Add generate new keypair button with confirmation
  - Implement clear keypair functionality with security warnings
  - Add import existing keypair option for compatibility
  - Specify key storage approach (raw JWK vs non-exportable CryptoKey)
  - Write component tests for keypair operations and confirmations
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_

### 🏗️ Integration & Core App

- [ ] 11. Create main App component and routing

  - Build main App component with tab-based navigation
  - Implement routing between Sign, Generate QR, Scan, and Manage tabs
  - Add global error boundary for unhandled errors
  - Create responsive layout that works on mobile and desktop
  - Add loading states and global error handling
  - Write integration tests for app navigation and error boundaries
  - _Requirements: 5.1, 5.2, 5.3, 5.4_

- [ ] 12. Add comprehensive error handling and user feedback

  - Implement global error handling with user-friendly messages
  - Add toast notifications for success/error states
  - Create help tooltips and educational content
  - Add browser compatibility warnings for unsupported features
  - Implement graceful degradation for missing capabilities
  - Write tests for error scenarios and user feedback
  - _Requirements: 1.4, 1.5, 3.5, 3.7, 6.4, 6.5_

- [ ] 13. Create end-to-end integration tests
  - Write tests for complete sign → generate → scan → verify workflow
  - Test cross-component data flow and state management
  - Add tests for error recovery and fallback scenarios
  - Test browser compatibility and feature detection
  - Implement visual regression tests for UI components
  - _Requirements: 1.1, 2.1, 3.3, 5.1, 6.1_

### 🎯 Phase 1 Milestone: Functional Proof-of-Concept

- [ ] 13.1. Create end-to-end demo workflow
  - Bundle Phase 1 deliverable: Sign on one device → scan and verify on another
  - Test complete workflow with basic UI (even if unstyled)
  - Document any issues or improvements needed for Phase 2
  - Create demo video or screenshots for documentation
  - Validate core cryptographic functionality works across devices
  - _Requirements: 1.1, 2.1, 3.3, 5.1, 6.1_

## Phase 2: Polish & Production Readiness

- [ ] 14. Add styling and responsive design

  - Implement CSS modules or styled-components for component styling
  - Create responsive design that works on mobile and desktop devices
  - Add proper spacing, typography, and visual hierarchy
  - Implement dark/light theme support
  - Add accessibility features (ARIA labels, keyboard navigation)
  - Test responsive design across different screen sizes
  - _Requirements: 5.1, 5.2, 5.3, 5.4_

- [ ] 15. Optimize performance and add PWA features

  - Implement code splitting and lazy loading for better performance
  - Add service worker for offline functionality
  - Optimize QR code generation and scanning performance
  - Add memory cleanup for camera resources
  - Implement proper error boundaries and recovery mechanisms
  - Write performance tests and benchmarks
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_

- [ ] 16. Create documentation and README
  - Write comprehensive README with setup and usage instructions
  - Document API interfaces and component props
  - Add security considerations and best practices
  - Create user guide with screenshots and examples
  - Document browser compatibility requirements
  - Add troubleshooting guide for common issues
  - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_
