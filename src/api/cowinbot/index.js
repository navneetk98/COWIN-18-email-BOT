const axios = require('axios');
const {
    response
} = require('express');
const mailgun = require("mailgun-js");
finalarr = [];
const cron = require('node-cron');
const fs = require('fs');
const moment = require('moment');

async function cronjobs() {



    try {
        cron.schedule('* * * * *', async () => {
            var sastadb = fs.readFileSync('./sastadb.txt', 'utf8').split('\n');

            for (i = 0; i < sastadb.length - 1; i++) {
                var words = sastadb[i].split(' ');
                console.log(words[1]);

                checkAvailability(words[1], words[0]);
            }

        });
    } catch (e) {
        console.log('an error occured: ' + JSON.stringify(e, null, 2));
        throw e;
    }



}

async function checkAvailability(dist, email) {
    const options = {
        headers: {
            'Accept-Language': 'hi_IN',
            'accept': 'application/json'
        }
    };
    var district_id = dist;
    let today = moment();
    let dateString = today.format('DD-MM-YYYY');
    console.log(dateString)
    const response = await axios.get('https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/calendarByDistrict?district_id=' + district_id + '&date=' + dateString, options);
    // console.log(response.data);
    let arra = [];
    
    arra = response.data.centers;


    arra.forEach(element => {
        var singlearr = element.sessions;
        singlearr.forEach(obj => {
            if (obj.min_age_limit === 45 && obj.available_capacity > 0) {
                var findata = {
                    'name': element.name,
                    'date': obj.date,
                    'available_capacity': obj.available_capacity
                }
                finalarr.push(findata);
            }
        })
    });

    if (finalarr.length !== 0) {
        const DOMAIN = 'navneetk.co';
        const mg = mailgun({
            apiKey: process.env.MAIL_KEY,
            domain: process.env.MAIL_DOMAIN
        });
        const data = {
            from: 'COWIN BOT <info@navneetk.co>',
            to: email,
            subject: 'We just found some 18+ vaccination centres!',
            text: JSON.stringify(finalarr, null, 2)
        };
        await mg.messages().send(data, function (error, body) {
            console.log(body);
            console.log(error);
        });
    }

}

module.exports = {
    main_bot: async (req, res) => {
        var email;
        var cityid;
        email = req.body.email;
        cityid = req.body.cityid;
        await checkAvailability(cityid, email);
        return res.status(200).send({
            'response': finalarr
        });
    },
    cron_bot: async (req, res) => {

        cronjobs();
        return res.status(200).send();
    },

    addtofile: async (req, res) => {
        var email;
        var cityid;
        email = req.body.email;
        cityid = req.body.cityid;

        const content = email + ' ' + cityid + '\n';

        fs.appendFile('./sastadb.txt', content, err => {
            if (err) {
                console.error(err)
                return
            }
            return res.status(200).send();
        })
        return res.status(200);
    },
    mailtest: async (req, res) => {
        const DOMAIN = 'navneetk.co';
        const mg = mailgun({
            apiKey: process.env.MAIL_KEY,
            domain: 'navneetk.co'
        });
        const data = {
            from: 'CowIN BOT <info@navneetk.co>',
            to: 'navneetkhandelwal1998@gmail.com',
            subject: 'We just found some 18+ vaccination centres!',
            text: 'Testing some Mailgun awesomness!'
        };
        await mg.messages().send(data, function (error, body) {
            console.log(body);
            console.log(error);
        });
    }
}