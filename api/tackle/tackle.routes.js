const express = require('express')
const { getTackles, addTackle } = require('./tackle.controller')
const router = express.Router()


router.get('/', getTackles)
router.post('/', addTackle)


module.exports = router