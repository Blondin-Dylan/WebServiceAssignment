const router = require('express').Router();
const axios = require('axios');
const cors = require('cors');

router.use(cors());

router.get('/', async function(req, res, next){
    let url = `https://maps.ottawa.ca/arcgis/rest/services/Parks_Inventory/MapServer/21/query?where=1%3D1&outFields=*&outSR=4326&f=json`;

    let fetch = await axios.get(url);

    let fetchResults = fetch.data.features;

    let result = {
        features: []
    }

    for (let i = 0; i < fetchResults.length; i++){
        let long = fetchResults[i].geometry.x;
        let lat = fetchResults[i].geometry.y;
        let name = fetchResults[i].attributes.PARKNAME;

        let court = {
            lat,long,name
        };
        result.features.push(court);

    }

    res.json(result);




});

module.exports = router;



