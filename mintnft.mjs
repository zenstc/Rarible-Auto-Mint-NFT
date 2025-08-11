import { config } from 'dotenv';
import { Wallet, JsonRpcProvider, parseUnits } from 'ethers';
import readline from 'readline-sync';

config();

// ========================================
// CONFIGURATION
// ========================================
const CONFIG = {
    provider: new JsonRpcProvider(process.env.RPC_URL),
    wallet: new Wallet(process.env.PRIVATE_KEY, new JsonRpcProvider(process.env.RPC_URL)),
    contractAddress: readline.question('Enter contract address: ').trim(),
    gasPrice: "0.1", // gwei
    gasLimit: 350000,
    chainId: 6342,
    minBalance: 0.000001, // ETH
    retryDelay: 2000 // ms
};

// ========================================
// UTILITIES
// ========================================
const log = (msg, type = 'info') => {
    const icons = { info: '🔄', success: '✅', error: '❌', warn: '⚠️', gas: '⛽', link: '🔍' };
    console.log(`[${new Date().toLocaleTimeString()}] ${icons[type]} ${msg}`);
};

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// ========================================
// CLAIM METHODS
// ========================================
class ClaimMethods {
    static buildComplexData(walletAddress) {
        return "0x84bb1e42" +
            walletAddress.slice(2).toLowerCase().padStart(64, '0') +
            "0000000000000000000000000000000000000000000000000000000000000001" +
            "000000000000000000000000eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee" +
            "0000000000000000000000000000000000000000000000000000000000000000" +
            "00000000000000000000000000000000000000000000000000000000000000c0" +
            "0000000000000000000000000000000000000000000000000000000000000160" +
            "0000000000000000000000000000000000000000000000000000000000000080" +
            "0000000000000000000000000000000000000000000000000000000000000000" +
            "ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff" +
            "0000000000000000000000000000000000000000000000000000000000000000" +
            "0000000000000000000000000000000000000000000000000000000000000000" +
            "0000000000000000000000000000000000000000000000000000000000000000";
    }

    static buildPublicClaimData(walletAddress) {
        return "0x1e83409a" + 
               walletAddress.slice(2).toLowerCase().padStart(64, '0') + 
               "0000000000000000000000000000000000000000000000000000000000000001";
    }

    static getMethods(walletAddress) {
        return {
            // Standard Methods
            standard: [
                { name: "mint()", data: "0x1249c58b" },
                { name: "freeMint()", data: "0x3f8b5c32" }
            ],
            
            // Claim Methods
            claims: [
                { name: "claim(1)", data: "0x379607f50000000000000000000000000000000000000000000000000000000000000001" },
                { name: "publicClaim", data: this.buildPublicClaimData(walletAddress) }
            ],
            
            // Complex Methods
            complex: [
                { name: "complexClaim", data: this.buildComplexData(walletAddress) }
            ]
        };
    }

    static getAllMethods(walletAddress) {
        const methods = this.getMethods(walletAddress);
        return [
            ...methods.standard,
            ...methods.claims, 
            ...methods.complex
        ];
    }
}

// ========================================
// TRANSACTION HANDLER
// ========================================
class TransactionHandler {
    constructor(config) {
        this.config = config;
    }

    async sendTransaction(method) {
        const tx = {
            to: this.config.contractAddress,
            data: method.data,
            value: 0,
            chainId: this.config.chainId,
            gasPrice: parseUnits(this.config.gasPrice, "gwei"),
            gasLimit: this.config.gasLimit
        };

        const sentTx = await this.config.wallet.sendTransaction(tx);
        log(`TX Hash: ${sentTx.hash}`, 'info');
        log(`https://www.oklink.com/megaeth-testnet/tx/${sentTx.hash}`, 'link');

        return await sentTx.wait();
    }

    async tryMethod(method) {
        try {
            log(`Trying: ${method.name}`, 'info');
            
            const receipt = await this.sendTransaction(method);

            if (receipt.status === 1) {
                log(`Success: ${method.name}`, 'success');
                
                const gasUsed = receipt.gasUsed;
                const gasCost = parseFloat(gasUsed * receipt.gasPrice) / 10 ** 18;
                log(`Gas Used: ${gasUsed} | Cost: ${gasCost.toFixed(6)} ETH`, 'gas');

                if (receipt.logs.length > 0) {
                    log(`${receipt.logs.length} events found - NFT minted! 🎉`, 'success');
                }
                
                return receipt;
            } else {
                log(`Failed: ${method.name}`, 'error');
                return null;
            }
        } catch (error) {
            log(`${method.name}: error method`, 'error');
            return null;
        }
    }
}

// ========================================
// MAIN CLAIM BOT
// ========================================
class NFTClaimBot {
    constructor(config) {
        this.config = config;
        this.txHandler = new TransactionHandler(config);
    }

    async checkBalance() {
        const balance = await this.config.provider.getBalance(this.config.wallet.address);
        const balanceETH = parseFloat(balance) / 10 ** 18;
        
        log(`Balance: ${balanceETH.toFixed(6)} ETH`, 'info');
        
        if (balanceETH < this.config.minBalance) {
            log('Insufficient ETH for gas fees', 'error');
            return false;
        }
        return true;
    }

    async executeClaim() {
        try {
            log('🚀 Starting NFT Claim Bot...', 'info');
            log(`👤 Wallet: ${this.config.wallet.address}`, 'info');
            log(`🎯 Contract: ${this.config.contractAddress}`, 'info');

            // Check balance
            if (!(await this.checkBalance())) {
                return;
            }

            // Get all methods
            const methods = ClaimMethods.getAllMethods(this.config.wallet.address);
            log(`📋 Loaded ${methods.length} claim methods`, 'info');

            // Try each method
            for (let i = 0; i < methods.length; i++) {
                const method = methods[i];
                const result = await this.txHandler.tryMethod(method);

                if (result) {
                    log('🎉 Claim completed successfully!', 'success');
                    return result;
                }

                // Wait before next attempt (except for last method)
                if (i < methods.length - 1) {
                    log(`⏳ Waiting ${this.config.retryDelay/1000}s before next method...`, 'warn');
                    await sleep(this.config.retryDelay);
                }
            }

            log('❌ All methods failed', 'error');

        } catch (error) {
            log(`💥 Fatal error: ${error.message}`, 'error');
        }
    }
}

// ========================================
// EXECUTION
// ========================================
const bot = new NFTClaimBot(CONFIG);
bot.executeClaim();