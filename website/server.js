const express = require('express');
const ejs = require('ejs');
const paypal = require('paypal-rest-sdk');
const config = require("../config.json")
var path = require("path")

paypal.configure({
  'mode': 'live', //sandbox or live
  'client_id': 'paypal client id',
  'client_secret': config.pclient
});

const app = express();

app.set('view engine', 'ejs');


app.listen(3000, () => console.log('Server Started'));

module.exports.app = app;