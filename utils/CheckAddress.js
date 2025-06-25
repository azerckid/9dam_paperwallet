// Wallet address validation utility
// Supports Bitcoin (legacy, P2SH, bech32) and Ethereum (0x...) formats

function isValidWalletAddress(address) {
    if (typeof address !== 'string') return false;
    // Bitcoin Legacy: starts with 1 or 3, 26-35 chars, base58
    const btcLegacy = /^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$/;
    // Bitcoin Bech32: starts with bc1, 42 or 62 chars, lowercase
    const btcBech32 = /^(bc1)[0-9a-z]{25,39}$/;
    // Ethereum: starts with 0x, 40 hex chars
    const eth = /^0x[a-fA-F0-9]{40}$/;
    return btcLegacy.test(address) || btcBech32.test(address) || eth.test(address);
}

export default isValidWalletAddress;