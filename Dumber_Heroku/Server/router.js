const router = require('express').Router();
const {dictionaryController} = require('./controller');

router.route('/dictionary')
    .get(dictionaryController.get)

module.exports = router;