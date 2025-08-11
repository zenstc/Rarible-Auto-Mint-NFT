# 🤖 NFT Claim Bot

Bot otomatis untuk mengklaim NFT gratis dengan berbagai metode claim yang berbeda.

## 📋 Fitur

- ✅ **5 Metode Claim Berbeda** - Mendukung berbagai jenis smart contract NFT
- ✅ **Auto Retry** - Otomatis mencoba metode lain jika gagal
- ✅ **Real-time Logging** - Monitor proses dengan timestamp
- ✅ **Gas Optimization** - Perhitungan biaya gas yang efisien
- ✅ **Explorer Integration** - Link langsung ke block explorer
- ✅ **Balance Check** - Validasi saldo ETH sebelum claim

## 🛠️ Instalasi

### 1. Clone/Download Project
```bash
git clone <repository-url>
cd Rarible-Auto-Mint-NFT
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Setup Environment
Buat file `.env` di root folder:
```env
RPC_URL=https://your-rpc-endpoint-here
PRIVATE_KEY=your-wallet-private-key-here
```

### 4. File Structure
```
Rarible-Auto-Mint-NFT/
├── mintnft.mjs         # Main bot file
├── package.json        # Dependencies
├── .env               # Environment variables
└── README.md          # This file
```

## 📦 Dependencies

```json
{
  "ethers": "^6.13.2",
  "dotenv": "^16.4.5", 
  "readline-sync": "^1.4.10"
}
```

## 🚀 Cara Penggunaan

### 1. Jalankan Bot
```bash
node mintnft.mjs
```

### 2. Input Kontrak
Masukkan alamat smart contract NFT yang ingin diklaim:
```
Enter contract address: 0x1234567890abcdef...
```

### 3. Bot Akan Otomatis
- ✅ Cek saldo wallet
- ✅ Mencoba 5 metode claim berbeda
- ✅ Menampilkan hasil real-time
- ✅ Berhenti saat berhasil atau semua metode gagal

## 🔧 Metode Claim yang Didukung

| No | Metode | Deskripsi |
|----|--------|-----------|
| 1 | `mint()` | Fungsi mint standar |
| 2 | `freeMint()` | Fungsi mint gratis |
| 3 | `claim(1)` | Claim dengan parameter angka |
| 4 | `publicClaim` | Claim publik dengan alamat |
| 5 | `complexClaim` | Claim dengan data kompleks |

## ⚙️ Konfigurasi

### Gas Settings
```javascript
gasPrice: "0.1",    // 0.1 gwei
gasLimit: 350000,   // Gas limit
chainId: 6342       // Megaeth Testnet
```

### Network Support
- 🌐 **Megaeth Testnet** (Chain ID: 6342)
- 🔧 Mudah diubah untuk network lain

## 📊 Contoh Output

```
[10:30:45] 🔄 Starting NFT Claim Bot...
[10:30:45] 👤 Wallet: 0x742d35Cc6436C0532925a3b2A2f6B02c4C2bD500
[10:30:45] 🎯 Contract: 0x1234567890abcdef...
[10:30:45] 🔄 Balance: 0.005000 ETH
[10:30:46] 📋 Loaded 5 claim methods
[10:30:46] 🔄 Trying: mint()
[10:30:47] 🔄 TX Hash: 0xabc123...
[10:30:47] 🔍 https://www.oklink.com/megaeth-testnet/tx/0xabc123...
[10:30:50] ✅ Success: mint()
[10:30:50] ⛽ Gas Used: 85000 | Cost: 0.000085 ETH
[10:30:50] ✅ 1 events found - NFT minted! 🎉
[10:30:50] ✅ 🎉 Claim completed successfully!
```

## ❌ Error Handling

### Error Types
- **`error method`** - Metode gagal atau tidak tersedia
- **`Insufficient ETH`** - Saldo tidak cukup untuk gas

### Troubleshooting
| Error | Solusi |
|-------|--------|
| `Insufficient ETH` | Tambah ETH ke wallet untuk gas fee |
| `All methods failed` | Kontrak mungkin tidak support claim/sudah habis |
| `Invalid contract address` | Pastikan alamat kontrak benar |

## ⚠️ Peringatan Keamanan

- 🔒 **Jangan share Private Key** ke siapapun
- 🔐 **Gunakan wallet terpisah** khusus untuk bot
- 💰 **Cek saldo minimum** sebelum menjalankan bot
- 🌐 **Verifikasi RPC URL** yang digunakan

## 🛡️ Best Practices

### 1. Keamanan
```bash
# Set permission file .env
chmod 600 .env

# Jangan commit .env ke git
echo ".env" >> .gitignore
```

### 2. Monitoring
- Selalu cek balance sebelum running
- Monitor gas price di network
- Backup private key dengan aman

### 3. Testing
- Test di testnet dulu
- Gunakan wallet dengan saldo kecil
- Verifikasi kontrak sebelum claim

## 🔧 Development

### Menambah Metode Baru
Edit di class `ClaimMethods`:
```javascript
newMethods: [
    { name: "airdrop()", data: "0x12345678" }
]
```

### Custom Network
Update di `CONFIG`:
```javascript
chainId: 1,  // Ethereum Mainnet
gasPrice: "20"  // 20 gwei
```

## 📞 Support

- 🐛 **Bug Report**: Buat issue di repository
- 💡 **Feature Request**: Diskusi di issues
- ❓ **Questions**: Check dokumentasi atau tanya di discussions

## 📄 License

MIT License - Bebas digunakan untuk tujuan apapun.

---
**BUILD WITH ❤️ and 🤖**