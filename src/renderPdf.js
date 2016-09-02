const fs = require('fs');
const phantom = require('phantom');
const tmp = require('tmp');

const createTempFile = () => new Promise((resolve) => {
    tmp.tmpName({postfix: '.pdf'}, function _tempNameGenerated(err, path) {
        if (err) {
            console.log('Error while creating temp file', err);
            process.exit(1);
        }
        resolve(path);
    });
});

const deleteFile = (path) => {
    fs.unlink(path, (err) => {
        if(err) {
            console.error('Error while deleting temp file', err);
            process.exit(1);
        }
    });
};


const tap = (fn) => (arg) => {fn(arg); return arg};

const runInPhantom = (fn) => {
    return phantom.create()
        .then(instance => {
            instance.process.on('error', (err) => console.error('Phantom Error:', err));
            instance.process.on('exit', () => {
                console.error('Phantom process exited. Shutting down...');
                process.exit(1);
            });
            return instance.createPage()
                .then(fn)
                .then(tap(() => instance.exit()))

        });
};

const setContent = (content, page) => page.setContent(content, 'http://example.com').then(() => page);

const loadFinished = (page) => new Promise((resolve) => {
    page.on('onLoadFinished', () => resolve(page));
    page.on('onError', (err) => console.log(err) );
});



const renderPdf = (path, body) => (page) => {
    return setContent(body, page)
        .then((page) => { console.log('set content done'); return page; })
        .then(loadFinished)
        .then((page) => { console.log('load finished'); return page; })
        .then((page) => page.render(path))
        .then(() => fs.createReadStream(path));
};

module.exports = (req, res) => {
    return createTempFile()
        .then((path) => {
            console.log('created tmp file');
            return Promise.all([runInPhantom(renderPdf(path, req.body)),Promise.resolve(path)]);
        })
        .then((pathAndSteam) => {
            const fileStream = pathAndSteam[0];
            const path = pathAndSteam[1];
            res.set('Content-Type', 'application/pdf');
            res.set('Content-Disposition', 'attachment; filename=invoice.pdf');
            return fileStream.pipe(res)
                .on('finish', () => deleteFile(path));
        })
        .catch((err) => {
            console.error(err);

            res.status(500).send(err);
        });
};

