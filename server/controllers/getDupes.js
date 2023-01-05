/**
 * GET /resources/summarize
 * Search for a term in the library
 * Query Params -
 * agg_field:
 * page_size:
 * sort:
 */

const express = require('express')
const { selectDupes, deleteDupes } = require('../queries/selectDupes')

const router = express.Router()

router.get(['/'], async (request, response) => {
    try {
        //
        console.log(request.query, request.params)
        if (!request.query.action) {
            response.send('action param required')
        }
        let body
        if (request.query.action == 'view') {
            body = await selectDupes(request.params, request.query)
        } else if (request.query.action == 'delete') {
            body = await deleteDupes()
        }

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
