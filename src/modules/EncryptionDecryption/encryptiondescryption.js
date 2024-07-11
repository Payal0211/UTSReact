import CryptoJS from 'crypto-js';

const secretKey = 'b14ca5898a4e4133bbce2ea2315a1916'; // Replace with your secret key

// Encrypt plaintext
function encrypt(plainText){
  if(plainText){
    const encrypted = CryptoJS.AES.encrypt(plainText, secretKey).toString();
    return encrypted;
  }
  return null;
}

function deCrypt(encryptedMessage){
    if(encryptedMessage){
      const bytes = CryptoJS.AES.decrypt(encryptedMessage, secretKey);
      const decrypted = bytes.toString(CryptoJS.enc.Utf8); 
      return decrypted;   
    }
    return null;
}

export { encrypt, deCrypt };

