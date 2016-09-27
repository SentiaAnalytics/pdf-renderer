const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const Path = require('path');
const pdf = require('html-pdf');
const PHANTOM_PATH = require('../config/config.json').PHANTOM_PATH;

const loadHtml = (file) => fs.readFileSync(Path.join(__dirname, file)).toString('utf-8');
const HTML_FOOTER = loadHtml('footer.html');

const PDF_DEFAULTS = {
  format: 'A4',
  orientation: 'portrait',
  border: '10mm',
  footer: {
    height: '30mm',
    contents: HTML_FOOTER
  },
  header: {
    height: '30mm'
  }
};
const pdfOptions = PHANTOM_PATH ? Object.assign({phantomPath: PHANTOM_PATH}, PDF_DEFAULTS) : PDF_DEFAULTS;

const app = express();

app.use(bodyParser.text({limit: '2mb'}));

// Ping function to ensure that the server is running from deploy job.
app.get('/ping', (req, res) => {
  res.send('Hello');
});

app.post('/pdf', (req, res) => {
  if (!req.body) {
    res.status(400).send({msg: 'request body should contain html'});
    return;
  }
  pdf.create(req.body, pdfOptions).toStream((err, stream) => {
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
