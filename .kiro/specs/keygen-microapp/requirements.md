# Requirements Document

## Introduction

The Keygen Microapp is an educational React application that teaches users the fundamentals of cryptographic key generation and management in the browser. It demonstrates how to generate Ed25519 keypairs using the Web Crypto API, manage key storage locally, and provide a user-friendly interface for key operations. This microapp serves as the foundation for understanding key-based identity systems and prepares users for more advanced concepts like P2P messaging and identity proofs.

## Requirements

### Requirement 1

**User Story:** As a student learning cryptography, I want to generate a new Ed25519 keypair with a single button click, so that I can understand how cryptographic keys are created in the browser.

#### Acceptance Criteria

1. WHEN the user clicks the "Generate Keypair" button THEN the system SHALL create a new Ed25519 keypair using the Web Crypto API
2. WHEN a keypair is generated THEN the system SHALL encode both public and private keys to Base64 format for storage and display
3. WHEN keypair generation is successful THEN the system SHALL display the public key in the user interface
4. WHEN keypair generation fails THEN the system SHALL display an appropriate error message to the user

### Requirement 2

**User Story:** As a user with generated keys, I want to see my public key displayed in a readable format, so that I can share it or verify its contents.

#### Acceptance Criteria

1. WHEN a keypair exists THEN the system SHALL display the public key in Base64 encoded format
2. WHEN displaying the public key THEN the system SHALL format it in a user-friendly, readable manner
3. WHEN no keypair exists THEN the system SHALL display a message indicating no keys are available
4. WHEN the public key is displayed THEN the system SHALL never show the private key in the interface

### Requirement 3

**User Story:** As a user who needs to share my public key, I want to copy it to my clipboard with one click, so that I can easily paste it elsewhere.

#### Acceptance Criteria

1. WHEN the user clicks the "Copy to Clipboard" button THEN the system SHALL copy the public key to the system clipboard
2. WHEN the copy operation is successful THEN the system SHALL provide visual feedback confirming the copy action
3. WHEN the copy operation fails THEN the system SHALL display an error message
4. IF no public key exists THEN the copy button SHALL be disabled or hidden

### Requirement 4

**User Story:** As a user who wants persistent access to my keys, I want my keypair to be automatically saved and restored, so that I don't lose my identity when I close and reopen the application.

#### Acceptance Criteria

1. WHEN a keypair is generated THEN the system SHALL store the private key in localStorage under the key "keypair"
2. WHEN the application loads THEN the system SHALL attempt to restore any existing keypair from localStorage
3. WHEN a keypair is successfully loaded from storage THEN the system SHALL display the corresponding public key
4. WHEN no stored keypair exists THEN the system SHALL display the initial state with no keys
5. WHEN storing keys THEN the system SHALL never expose the private key in the user interface

### Requirement 5

**User Story:** As a user who wants to start fresh, I want to clear my stored keypair, so that I can generate a new identity or remove my keys from the browser.

#### Acceptance Criteria

1. WHEN the user clicks the "Clear Stored Keypair" button THEN the system SHALL remove all keypair data from localStorage
2. WHEN keys are cleared THEN the system SHALL update the user interface to show no keys are present
3. WHEN the clear operation is successful THEN the system SHALL provide confirmation to the user
4. WHEN clearing keys THEN the system SHALL ensure all traces of the private key are removed from memory and storage

### Requirement 6

**User Story:** As a security-conscious user, I want assurance that my private key is handled securely, so that I can trust the application with my cryptographic identity.

#### Acceptance Criteria

1. WHEN handling private keys THEN the system SHALL never display the private key in the user interface
2. WHEN storing private keys THEN the system SHALL only store them in the browser's localStorage
3. WHEN the application runs THEN the system SHALL never transmit private keys over the network
4. WHEN keys are cleared THEN the system SHALL ensure complete removal from all storage locations
5. WHEN errors occur THEN the system SHALL never expose private key data in error messages or logs
