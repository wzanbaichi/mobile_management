import NodeRSA from 'node-rsa'
export default {
    encryptStr(str) {
        let newKey = new NodeRSA('-----BEGIN PUBLIC KEY-----MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDe941OXMpg4TQ1153RqbeI/dQibqUX4Z6dQOswsj/n2HbpfZ3sSXao0o9QRiFaXfuZHT8J1AFup223WWg0N5236BTZcs7fyIzHlFb4bSsFBdbpGMRF8oMa+jK5KQw7VDcvCo5/HJIBbmRRwrxfhVYQY2Ikp5DYJXan5I5ssvytkwIDAQAB-----END PUBLIC KEY-----');  
        newKey.setOptions({encryptionScheme: 'pkcs1'});
        return newKey.encrypt(str,'base64');
    }
}