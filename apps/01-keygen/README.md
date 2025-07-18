# 🔑 Mesh Labs — Microapp 01: Key Generator

This is the first learning microapp in the Mesh Labs course. It focuses on generating and managing cryptographic keys directly in the browser using Web Crypto API.

---

## 🎯 Purpose

Learn how to:

- Generate an Ed25519 keypair in the browser
- Display the public key in a user-friendly format (Base64)
- Safely store the private key locally
- Load, clear, and persist key state
- Understand the fundamentals of key-based identity

---

## 🚀 Features

| Feature               | Description                                      |
| --------------------- | ------------------------------------------------ |
| ✅ Generate Keypair   | Create an Ed25519 keypair on button click        |
| ✅ Display Public Key | Show base64-encoded public key                   |
| ✅ Copy Key           | Copy public key to clipboard                     |
| ✅ Store Privately    | Save private key to localStorage (not displayed) |
| ✅ Load Existing      | Restore keypair on app load                      |
| ✅ Clear Keys         | Remove stored keys with a button                 |

---

## 🧱 Tech Stack

- **React + TypeScript** (via Vite)
- **Web Crypto API** (SubtleCrypto for Ed25519)
- **Tailwind CSS** (for styling)
- **Custom React Hooks** (for separation of concerns)
- **Vitest + @testing-library/react** (for testing)
- **pnpm workspaces** (monorepo management)

## 🏗️ Architecture

The app follows modern React patterns with custom hooks for separation of concerns:

- **`useKeyPairState`** - Manages component state (loading, error, public key)
- **`useKeyPairStorage`** - Handles loading stored keys on app initialization
- **`useKeyPairGeneration`** - Manages keypair generation with error handling
- **`useClipboard`** - Handles clipboard operations with fallbacks
- **`useKeyPairClear`** - Manages clearing stored keypairs

This architecture makes the code:

- **Testable** - Each hook can be tested in isolation
- **Reusable** - Hooks can be used in other components
- **Maintainable** - Clear separation of responsibilities
- **Type-safe** - Full TypeScript coverage

---

## 📦 Folder Structure

```
01-keygen/
├── public/
├── src/
│   ├── components/
│   │   └── KeyViewer.tsx       # Main UI component
│   ├── hooks/                  # Custom React hooks
│   │   ├── useKeyPairState.ts  # State management
│   │   ├── useKeyPairStorage.ts # Storage operations
│   │   ├── useKeyPairGeneration.ts # Key generation
│   │   ├── useClipboard.ts     # Clipboard operations
│   │   ├── useKeyPairClear.ts  # Clear operations
│   │   └── __tests__/          # Hook tests
│   ├── utils/
│   │   ├── crypto.ts           # Crypto utilities
│   │   └── storage.ts          # Storage utilities
│   ├── test/
│   │   └── setup.ts            # Test configuration
│   ├── App.tsx
│   └── main.tsx
├── package.json
├── vite.config.ts
└── README.md
```

---

## 🛠️ Development

This microapp is part of a pnpm workspace. You can run it in two ways:

### From the app directory:

```bash
cd apps/01-keygen
pnpm dev          # Start development server
pnpm test         # Run tests
pnpm build        # Build for production
pnpm lint         # Run linter
```

### From the root directory:

```bash
pnpm --filter 01-keygen dev    # Start development server
pnpm --filter 01-keygen test   # Run tests
pnpm --filter 01-keygen build  # Build for production
```

### Testing

The project includes comprehensive tests for all custom hooks and utilities:

- **81 tests** covering all functionality
- **Vitest** with jsdom environment
- **@testing-library/react** for hook testing
- **Mock implementations** for browser APIs

---

## ⚠️ Notes

- The private key is stored in the browser only — it is never shown or transmitted.
- Public keys are encoded in Base64 for display and sharing.
- This is a foundational building block for invite logic, P2P messaging, and identity proofs in later microapps.

---

## 👤 Author

Eduard Shavyrko · [LinkedIn](https://www.linkedin.com/in/edshav) · [GitHub](https://github.com/edshav)
