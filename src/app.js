const express = require('express');
const bodyParser = require('body-parser');
const pdf = require('html-pdf');

const app = express();

app.use(bodyParser.text());

app.post('/pdf', (req, res) => {
    pdf.create(req.body).toStream(function(err, stream){
        res.set('Content-Type', 'application/pdf');
        res.set('Content-Disposition', 'attachment; filename=invoice.pdf');
        stream.pipe(res);
    });
});

module.exports = app;
