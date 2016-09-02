const pdf = require('html-pdf');

module.exports = (req, res) => {
    pdf.create(req.body).toStream(function(err, stream){
        res.set('Content-Type', 'application/pdf');
        res.set('Content-Disposition', 'attachment; filename=invoice.pdf');
        stream.pipe(res);
    });
};