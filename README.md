# 🔐 Mesh Labs — Learn Decentralized Networking by Building Microapps

Welcome! This is a self-directed learning course in which I, as a frontend developer, explore decentralized infrastructure by building a series of 7 progressively complex microapps.

Each microapp focuses on core topics like:

- Peer-to-peer communication (P2P)
- Mesh networks
- Cryptographic key management
- Key-based authentication (no login)
- Identity without central authority
- IP pool and invite systems
- WebRTC & secure messaging

## 📚 Course Structure

| #   | Title              | Tech Stack                 | Learning Focus                                     |
| --- | ------------------ | -------------------------- | -------------------------------------------------- |
| 1   | 🔑 Key Generator   | Web Crypto API, React      | Generate and store Ed25519 keypairs in the browser |
| 2   | 📲 QR Linker       | QR Code, Key Signatures    | Bind identity to key using signed QR code          |
| 3   | 🎟️ Invite Minting  | CIDR IP pools, Backend API | Create invite tokens tied to limited IP resources  |
| 4   | 🛂 Key Dashboard   | Stateless Auth, UI UX      | Access dashboard based on key signature            |
| 5   | 🗂️ IP Pool Manager | Supabase/Express + UI      | Manage IP invites, rate-limit logic                |
| 6   | 🛰️ P2P Messenger   | WebRTC, QR-based Signaling | Private peer-to-peer chat                          |
| 7   | 🧱 Mesh Node Sync  | Graph sync logic           | Synchronize node status and trust edges            |

## 🧠 Goal

To deeply understand how to build a secure, decentralized, invitation-only network using frontend-first technologies and cryptographic primitives — and grow my engineering skills beyond traditional web development.

## 🏗️ Project Structure

This project uses **pnpm workspaces** to manage multiple microapps in a monorepo structure:

```
mesh-labs/
├── apps/
│   ├── 01-keygen/          # Key Generator microapp
│   ├── 02-qr-linker/       # QR Linker microapp (planned)
│   └── ...                 # Additional microapps
├── packages/               # Shared packages (if needed)
├── pnpm-workspace.yaml     # Workspace configuration
└── package.json            # Root package.json
```

### 🛠️ Development Commands

```bash
# Install dependencies for all workspaces
pnpm install

# Run a specific microapp
cd apps/01-keygen
pnpm dev

# Run commands from root for specific workspace
pnpm --filter 01-keygen dev
pnpm --filter 01-keygen test
pnpm --filter 01-keygen build

# Install dependencies for specific workspace
pnpm --filter 01-keygen add <package-name>
```

## 🚧 Status

Work in progress. One microapp at a time.

## 👤 Author

Eduard Shavyrko · [LinkedIn](https://www.linkedin.com/in/edshav) · [GitHub](https://github.com/edshav)
