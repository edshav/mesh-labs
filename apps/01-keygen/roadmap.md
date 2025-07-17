# 🛣️ Roadmap – Microapp 01: Key Generator

## ✅ Core Goals

- [ ] ✅ Create generateKey() utility using Web Crypto API (Ed25519)
- [ ] ✅ Encode public/private key to Base64 for display/storage
- [ ] ✅ Store private key in localStorage under "keypair"
- [ ] ✅ Load keypair from localStorage on startup
- [ ] ✅ Render public key in UI
- [ ] ✅ Add "Copy to Clipboard" button
- [ ] ✅ Add "Clear Stored Keypair" button

## 📘 Optional Enhancements

- [ ] Export keypair as downloadable JSON
- [ ] Add QR code output for public key
- [ ] Use IndexedDB instead of localStorage (for more security)
- [ ] Sign a message and show signature

## 🧠 Reflection Checklist (after building)

- [ ] I understand how Ed25519 key generation works in the browser
- [ ] I understand how to store and retrieve data securely in localStorage
- [ ] I can work with binary data and encode/decode Base64
