const CryptoJS = require("crypto-js");

const keySize = 256;
const iterations = 10000;

async function encrypt(msg, password) {
    const salt = CryptoJS.lib.WordArray.random(128 / 8);
    const key = CryptoJS.PBKDF2(password, salt, {
        keySize: keySize / 8, // 32 bytes key size
        iterations: iterations
    }); // 32 bytes

    const iv = CryptoJS.lib.WordArray.random(128 / 8);

    const encrypted = CryptoJS.AES.encrypt(msg, key, {
        iv: iv,
        padding: CryptoJS.pad.Pkcs7,
        mode: CryptoJS.mode.CBC

    });
    const transitmessage = salt.toString() + iv.toString() + encrypted.toString();
    return transitmessage;
}

async function decrypt(transitmessage, password) {
    const salt = CryptoJS.enc.Hex.parse(transitmessage.substr(0, 32));
    const iv = CryptoJS.enc.Hex.parse(transitmessage.substr(32, 32))
    const encrypted = transitmessage.substring(64);

    const key = CryptoJS.PBKDF2(password, salt, {
        keySize: keySize / 8,
        iterations: iterations
    });

    const decrypted = CryptoJS.AES.decrypt(encrypted, key, {
        iv: iv,
        padding: CryptoJS.pad.Pkcs7,
        mode: CryptoJS.mode.CBC

    })
    return decrypted;
}

export {
    encrypt,
    decrypt
}