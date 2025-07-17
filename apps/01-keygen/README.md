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

- React + TypeScript (via Vite)
- Web Crypto API (SubtleCrypto)
- Tailwind CSS (optional)

---

## 📦 Folder Structure

01-keygen/
├── public/
├── src/
│ ├── components/
│ │ └── KeyViewer.tsx
│ ├── utils/
│ │ └── crypto.ts
│ ├── App.tsx
│ └── main.tsx
├── package.json
└── README.md

---

## ⚠️ Notes

- The private key is stored in the browser only — it is never shown or transmitted.
- Public keys are encoded in Base64 for display and sharing.
- This is a foundational building block for invite logic, P2P messaging, and identity proofs in later microapps.

---

## 👤 Author

Eduard Shavyrko · [LinkedIn](https://www.linkedin.com/in/edshav) · [GitHub](https://github.com/edshav)
