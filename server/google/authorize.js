const { authenticate } = require('@google-cloud/local-auth')
const {
    loadSavedCredentialsIfExist,
    saveCredentials
} = require('./authentication')
const { SCOPES, CREDENTIALS_PATH } = require('../statics').google
console.log(CREDENTIALS_PATH)
module.exports = {
    /**
     * Load or request or authorization to call APIs.
     *
     */
    async authorize() {
        let client = await loadSavedCredentialsIfExist()
        if (client) {
            return client
        }
        client = await authenticate({
            scopes: SCOPES,
            keyfilePath: CREDENTIALS_PATH
        })
        if (client.credentials) {
            await saveCredentials(client)
        }
        return client
    }
}
