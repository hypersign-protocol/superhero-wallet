const hsdk = require('lds-sdk');
const { HS_NODE_BASE_URL, HS_DID_SCHEME } = require('./hsConstants')

const options = { nodeUrl: HS_NODE_BASE_URL, didScheme: HS_DID_SCHEME };
export const hypersignSDK = {
    did: hsdk.did(options),
    credential: hsdk.credential(options),
};