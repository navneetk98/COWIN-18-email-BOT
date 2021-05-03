var express = require('express');
var router = express.Router();
const axios = require('axios');

// import csc from 'country-state-city';
// const csc = require('country-state-city');

var fs = require('fs');

/* GET home page. */
router.get('/', function (req, res, next) {
    console.log('hi');
    // console.log(csc.getStatesOfCountry('IN'));
    states = JSON.parse(fs.readFileSync('public/states.json'));
    console.log(states.states);
    res.render('index', {state: states.states, status:false});
});

router.post("/remind", async function (request, response) {
    const email = request.body.email;
    const state = request.body.states;
    const dist = request.body.dist;
    console.log(email + state + dist);
    let payload = { email: email, cityid: dist };
    let res = await axios.post('http://20.197.27.108:7000/api/adduser', payload);
    let data = res.data;
    if(res.status === 200) {
        response.render('index', {state: states.states, status:true});
    } else {
        response.render('index', {state: states.states, status:false});
    }
    console.log(data);
});

module.exports = router;
