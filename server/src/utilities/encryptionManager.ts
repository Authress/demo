import KMS from 'aws-sdk/clients/kms';
import crypto from 'crypto';

const kmsClient = new KMS({ region: 'eu-west-1' });

const encryptedPrivateKey = 'AQICAHiB6MeEskvII63QA/xJiOU/FO71vHGpibFJo5O4z3m1GwEHO2fti7c0xUBVzgmAMwK1AAAAfjB8BgkqhkiG9w0BBwagbzBtAgEAMGgGCSqGSIb3DQEHATAeBglghkgBZQMEAS4wEQQMVeRC9P0YvzDodn5kAgEQgDudrZuxCnIjFF2pjOBm44TvrMV9WjoKDgX/DZOUwS4IC2sYTPm7Dw1LMhORnLI/VaV4OulRkUw78uYj9w==';
const algorithm = 'aes-256-ctr';

class EncryptionManager {
  constructor() {
    this.privateKeyAsync = null;
  }

  initialize() {
    if (!this.privateKeyAsync) {
      this.privateKeyAsync = kmsClient.decrypt({ CiphertextBlob: Buffer.from(encryptedPrivateKey, 'base64') }).promise().then(keyData => keyData.Plaintext.toString()).catch(error => {
        console.log({ title: 'Failed to initialize encryption manager', level: 'ERROR', error });
      });
    }
  }

  async getKey() {
    const encryptedServiceClientAccessKey = 'eyJkYXRhIjoieC9YMU1ISlI0UjkwUXBWOUkvSGQzdFU1MnZ6S1JxWVV3R3dnTitGbnFESXliUUFCTTFBbERRV1N1Q09iTW53azlMZ1hCeURreDFYa0ZEUEovV3ROTk1YbHlqelk4NUhDNkV4UThveFNLWUtRc1JiYjV6VkJJSVdySFZ5ajVTbFkxWi9Lb1BJY0VOK3g4QzNKTisvVW1FbS9TbHZRVDJsdGIxdz0iLCJpdiI6Imx1ZDFkS0U2T3VPUjYvSnB1QlA4akE9PSJ9';

    const result = await this.decryptData(encryptedServiceClientAccessKey);
    return result;
  }

  async decryptData(fullEncryptionData) {
    if (!fullEncryptionData) {
      return null;
    }
    this.initialize();
    try {
      const privateKey = await this.privateKeyAsync;
      const { data: encryptionData, iv: initializationVector } = JSON.parse(Buffer.from(fullEncryptionData, 'base64').toString());
      const decipher = crypto.createDecipheriv(algorithm, privateKey, Buffer.from(initializationVector, 'base64'));
      const data = Buffer.concat([decipher.update(Buffer.from(encryptionData, 'base64')), decipher.final()]);
      return data.toString();
    } catch (error) {
      console.log({ title: 'Failed to decrypt data', level: 'ERROR', error, fullEncryptionData });
      return null;
    }
  }
  
  async encryptData(data) {
    const privateKey = await kmsClient.decrypt({ CiphertextBlob: Buffer.from(encryptedPrivateKey, 'base64') }).promise().then(keyData => keyData.Plaintext.toString());
    const initializationVector = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(algorithm, privateKey, initializationVector);
    const encryptedData = Buffer.concat([cipher.update(data), cipher.final()]);
    const fullEncryptionData = Buffer.from(JSON.stringify({
      data: encryptedData.toString('base64'),
      iv: initializationVector.toString('base64')
    })).toString('base64');
    const decryptedData = await this.decryptData(fullEncryptionData);
    if (data !== decryptedData) {
      throw Error('EncryptionNotSymmetric');
    }

    console.log('Encrypted Data: ', fullEncryptionData);
    return fullEncryptionData;
  }
}

export default new EncryptionManager();