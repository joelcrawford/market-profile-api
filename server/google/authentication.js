const fs = require('fs').promises
const path = require('path')
const process = require('process')

const { google } = require('googleapis')
const { CREDENTIALS_PATH, TOKEN_PATH } = require('../statics').google
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN = path.join(TOKEN_PATH, 'token.json')

module.exports = {
    /**
     * Reads previously authorized credentials from the save file.
     *
     * @return {Promise<OAuth2Client|null>}
     */
    async loadSavedCredentialsIfExist() {
        try {
            const content = await fs.readFile(TOKEN)
            const credentials = JSON.parse(content)
            return google.auth.fromJSON(credentials)
        } catch (err) {
            return null
        }
    },

    /**
     * Serializes credentials to a file comptible with GoogleAUth.fromJSON.
     *
     * @param {OAuth2Client} client
     * @return {Promise<void>}
     */

    async saveCredentials(client) {
        const content = await fs.readFile(CREDENTIALS_PATH)
        const keys = JSON.parse(content)
        const key = keys.installed || keys.web
        const payload = JSON.stringify({
            type: 'authorized_user',
            client_id: key.client_id,
            client_secret: key.client_secret,
            refresh_token: client.credentials.refresh_token
        })
        await fs.writeFile(TOKEN, payload)
    }
}
