  
const express = require("express");
const {
    main_bot,
    mailtest
   } = require('./index');
module.exports = () => {
  const routes = express.Router();
  routes.get('/test', (req, res) => {
    return res.status(200).send("Working....");
  });
  routes.post('/bot', (req, res) => {
    return main_bot(req, res);
});
routes.get('/mail', (req, res) => {
  return mailtest(req, res);
});
// routes.post('/simple_verify', (req, res) => {
//   return in_simple(req, res);
// });
// routes.post('/out_verify', (req, res) => {
//   return out_fun(req, res);
// });
  return routes;
};