const express = require("express");
const {
  test_bot,
    mailtest,
    cron_bot,
    addtofile
   } = require('./index');
module.exports = () => {
  const routes = express.Router();
  routes.get('/test', (req, res) => {
    return res.status(200).send("Working....");
  });
  routes.post('/testbot', (req, res) => {
    return test_bot(req, res);
});
routes.get('/mail', (req, res) => {
  return mailtest(req, res);
});
routes.get('/mailcron', (req, res) => {
  return cron_bot(req, res);
});
routes.post('/adduser', (req, res) => {
  return addtofile(req, res);
});
// routes.post('/simple_verify', (req, res) => {
//   return in_simple(req, res);
// });
// routes.post('/out_verify', (req, res) => {
//   return out_fun(req, res);
// });
  return routes;
};