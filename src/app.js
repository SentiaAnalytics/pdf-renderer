const express = require('express');
const renderPdf = require('./renderPdf');
const bodyParser = require('body-parser')

const app = express();

app.use(bodyParser.text());

app.post('/pdf', renderPdf);

module.exports = app;
