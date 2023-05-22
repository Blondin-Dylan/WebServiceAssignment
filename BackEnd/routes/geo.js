const router = require('express').Router();
const axios = require('axios'); 
const cors = require('cors');

router.use(cors());

router.get('/', async function (req, res, next) {

    let remote = "206.167.123.9";

    let url = `https://api.ipgeolocation.io/ipgeo?apiKey=b1b30dff03fa4028939c40edcef48ac0&ip=${remote}`;

    let fetch = await axios.get(url); 

    let lat = fetch.data.latitude;
    let long = fetch.data.longitude;
    res.json({ "lat": lat, "long": long });

});

module.exports = router;
