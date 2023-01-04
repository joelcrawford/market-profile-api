/**
 * GET /resources/summarize
 * Search for a term in the library
 * Query Params -
 * agg_field:
 * page_size:
 * sort:
 */

const express = require('express')
const { selectStats } = require('../queries/selectStats')

const router = express.Router()

router.get(['/'], async (request, response) => {
    try {
        // send params to elasticsearch DSL
        const body = await selectStats()
        if (!body) {
            return response.status(422).json({
                errors: [
                    {
                        msg: `No matches for provided parameters, ${JSON.stringify(
                            request.query
                        )}`
                    }
                ]
            })
        }

        // return result
        return response.send(body)
    } catch (error) {
        return response.send(error)
    }
})

module.exports = router
