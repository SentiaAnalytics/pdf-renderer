const express = require('express');
const bodyParser = require('body-parser');
const pdf = require('html-pdf');

const app = express();

app.use(bodyParser.text());

// Ping function to ensure that the server is running from deploy job.
app.get('/ping', (req, res) => {
  res.send('Hello');
});

app.post('/pdf', (req, res) => {
  if (!req.body) {
    res.status(400).send({msg: 'request body should contain html'});
    return;
  }
  pdf.create(req.body).toStream((err, stream) => {
    if (err) {
      console.log('Error while creating PDF', err);
      res.status(500).send({msg: 'Error while generating PDF'});
      return;
    }
    res.set('Content-Type', 'application/pdf');
    res.set('Content-Disposition', 'attachment; filename=invoice.pdf');
    stream.pipe(res);
  });
});

module.exports = app;
