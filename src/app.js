const express = require('express');
const renderPdf = require('./html2pdf');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.text());

app.post('/pdf', renderPdf);

module.exports = app;
