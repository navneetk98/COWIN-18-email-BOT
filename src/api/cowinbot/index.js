const axios = require('axios');
const {
    response
} = require('express');
const mailgun = require("mailgun-js");
finalarr = [];
const cron = require('node-cron');

async function cronjobs() {
    try {
        cron.schedule('0 * * * *', async () => {
            await checkAvailability(670);
        });
    } catch (e) {
        console.log('an error occured: ' + JSON.stringify(e, null, 2));
        throw e;
    }
}

async function checkAvailability(dist,email) {
    const options = {
        headers: {
            'Accept-Language': 'hi_IN',
            'accept': 'application/json'
        }
    };
    var district_id = dist;

    const response = await axios.get('https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/calendarByDistrict?district_id=' + district_id + '&date=02-05-2021', options);
    // console.log(response.data);
    var arra = [];
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
            from: 'CowIN BOT <info@navneetk.co>',
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
        await checkAvailability(670,'navneetkhandelwal1998@gmail.com');
        console.log(finalarr);
        return res.status(200).send({
            'response': finalarr
        });
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