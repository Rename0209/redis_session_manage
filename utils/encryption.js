import CryptoJS from "crypto-js";
import dotenv from "dotenv";
dotenv.config();

export const decryptAES = (encryptedHex) => {
    try {
        // Chuyển đổi hex về CryptoJS format
        const ciphertext = CryptoJS.enc.Hex.parse(encryptedHex);

        // Tạo key từ SECRET_KEY
        const key = CryptoJS.enc.Utf8.parse(process.env.SECRET_KEY);

        // Giải mã AES
        const decrypted = CryptoJS.AES.decrypt(
            { ciphertext }, // Dùng object có `ciphertext`
            key,
            {
                mode: CryptoJS.mode.ECB,
                padding: CryptoJS.pad.Pkcs7
            }
        );

        return decrypted.toString(CryptoJS.enc.Utf8); // Trả về chuỗi đã giải mã
    } catch (error) {
        console.error("Giải mã thất bại:", error);
        return null; // Trả về null nếu lỗi
    }
};