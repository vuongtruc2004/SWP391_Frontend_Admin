import CryptoJS from "crypto-js";

const SECRET_KEY = "734a9018791a6962376dbcb19dbbcdc8";

export const decryptWithAES = (encryptedText: string): OrderRequest | null => {
    try {
        const bytes = CryptoJS.AES.decrypt(encryptedText, SECRET_KEY);
        const decryptedText = bytes.toString(CryptoJS.enc.Utf8);

        if (!decryptedText) return null;

        return JSON.parse(decryptedText);
    } catch {
        return null;
    }
};