const defaultPage = 'index';

const router = require('express').Router();

router.get('/', function (req, res, next) {
	res.send("loaded");
});

module.exports = router;
