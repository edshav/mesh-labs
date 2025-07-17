# 🛣️ Mesh Labs Roadmap

A step-by-step breakdown of the learning process via hands-on coding.

---

## ✅ 1. Key Generator (01-keygen)

- [ ] Generate Ed25519 keypair in browser using Web Crypto API
- [ ] Export public/private keys as Base64
- [ ] Store private key in localStorage or IndexedDB
- [ ] Display public key and allow copy
- [ ] README: explain Ed25519 and browser crypto caveats

---

## ⏭️ Upcoming Microapps

### 2. QR Linker (02-qr-bind)

- Sign a message with your private key
- Encode message + signature into QR code
- Scan and verify on another device

### 3. Invite Minting (03-invite-mint)

- Server-side token issuing based on IP pool (e.g. 10.0.0.0/24)
- Limit number of invites per peer (minted per address)
- Revoke/expire logic

### 4. Key Dashboard (04-user-dashboard)

- Authenticate via signature
- Personalize dashboard based on key
- Store preferences locally

### 5. IP Pool Manager (05-ip-pool-manager)

- Backend API for managing available IPs and invites
- React UI for viewing/assigning/releasing IPs

### 6. P2P Messenger (06-p2p-chat)

- Use WebRTC DataChannels
- Manual signaling via QR
- End-to-end encryption + temporary identity

### 7. Node Sync Map (07-node-sync)

- Visualize trust relationships between nodes
- Simple sync protocol for graph updates
