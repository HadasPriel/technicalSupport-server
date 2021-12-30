const tackleService = require('./tackle.service')

async function getTackles(req, res) {
    try {
        const tackles = await tackleService.query(req.query)
        res.send(tackles)
    } catch (err) {
        console.log('Cannot get tackles', err)
        res.status(500).send({ err: 'Failed to get tackles' })
    }
}

async function addTackle(req, res) {
    try {
        const accounts = await tackleService.add(req.body)
        res.send(accounts)
    } catch (err) {
        console.log('Cannot add tackle', err)
        res.status(500).send({ err: 'Failed to add tackle' })
    }
}

module.exports = {
    getTackles,
    addTackle
}