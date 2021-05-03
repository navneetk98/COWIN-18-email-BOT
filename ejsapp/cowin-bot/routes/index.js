var express = require('express');
var router = express.Router();
const axios = require('axios');

var fs = require('fs');

/* GET home page. */
router.get('/', function (req, res, next) {
    states = JSON.parse(fs.readFileSync('public/states.json'));
    // console.log(states.states);
    res.render('index', {state: states.states, status:false, err1:false, err2:false, err3:false});
});

router.post("/remind", async function (request, response) {
    const email = request.body.email;
    const state = request.body.states;
    const dist = request.body.dist;
    // console.log(email);
    // console.log(state);
    // console.log(dist);
    let err1 = false;
    let err2 = false;
    let err3 = false;
    if(email === "") {
        err1 = true;
    }
    if(state === undefined) {
        err2 = true;
    }
    if(dist === undefined) {
        err3 = true;
    }
    if(err1 || err2 || err3) {
        response.render('index', {state: states.states, status:false, err1: err1, err2: err2, err3: err3});
    }
    let payload = { email: email, cityid: dist };
    let res = await axios.post('http://20.197.27.108:7000/api/adduser', payload);
    let data = res.data;
    if(res.status === 200) {
        response.render('index', {state: states.states, status:true, err1: err1, err2: err2, err3: err3});
    } else {
        response.render('index', {state: states.states, status:false, err1: err1, err2: err2, err3: err3});
    }
    // console.log(data);
});

module.exports = router;
