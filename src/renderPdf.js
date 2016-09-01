const fs = require('fs');
const phantom = require('phantom');
const path = require('path');

const phantomPage = phantom.create()
  .then(instance => {
    instance.process.on('error', (err) => console.error('Phantom Error:', err));
    instance.process.on('exit', () => { console.error('Phantom process exited. Shutting down...');
      process.exit(1);
    })
    return instance.createPage();
  });

const setContent = (content) => (page) => page.setContent(content, 'http://example.com').then(() => page);

const loadFinished = (page) => new Promise((resolve) => page.on('onLoadFinished', () => resolve(page)));


module.exports = (req, res) => {
  const fileName = `files/file-${Math.random() * 10000}.pdf`;
  phantomPage
    .then(setContent(req.body))
    .then(loadFinished)
    .then((page) => page.render(fileName))
    .then(() => fs.createReadStream(fileName).pipe(res))
    .catch((err) => {
      console.error(err);
      res.status(500).send(err);
    });
}
