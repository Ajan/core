// TODO V2: Implement checksum for addresses
class Crypto {
  static get lib() { return window.crypto.subtle; }

  static get settings() {
    const hashAlgo = {name: 'SHA-256'};
    const signAlgo = 'ECDSA';
    const curve = 'P-256';    // can be 'P-256', 'P-384', or 'P-521'
    return {
        hashAlgo: hashAlgo,
        curve: curve,
        keys: {name: signAlgo, namedCurve: curve},
        sign: {name: signAlgo, hash: hashAlgo}
      };
  }

  static sha256(buffer) {
    return Crypto.lib.digest(Crypto.settings.hashAlgo, buffer);
  }

  static generateKeys() {
    return Crypto.lib.generateKey(Crypto.settings.keys, true, ['sign', 'verify']);
  }

  static exportPrivate(privateKey) {
    return Crypto.lib.exportKey('pkcs8', privateKey);
  }

  static importPrivate(privateKey) {
    return Crypto.lib.importKey('pkcs8', privateKey);
  }

  static exportPublic(publicKey, format ='spki') {
    return Crypto.lib.exportKey(format, publicKey);
  }

  static exportAddress(publicKey) {
    return Crypto.exportPublic(publicKey).then(Crypto.publicToAddress);
  }

  static importPublic(publicKey) {
    return Crypto.lib.importKey('spki', publicKey, Crypto.settings.keys, true, ['verify']);
  }

  static publicToAddress(publicKey) {
    return Crypto.sha256(publicKey).then(hash => hash.slice(0, 24));
  }

  static sign(privateKey, data) {
    return Crypto.lib.sign(Crypto.settings.sign, privateKey, data);
  }

  static verify(publicKey, signature, data) {
    return Crypto.importPublic(publicKey)
        .then(key => Crypto.lib.verify(Crypto.settings.sign, key, signature, data));
  }
}
