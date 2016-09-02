const app = require('./app');

const assert = require('assert');
const request = require('supertest');
describe('POST /pdf', function() {
    it('respond with pdf file', function(done) {
        request(app)
            .post('/pdf')
            .set('Content-Type', 'text/plain')
            .set('Accept', 'application/pdf')
            .send('<html>\n<body><h1>Hello</h1></body>\n</html>')
            .expect(200)
            .expect('Content-Type', /pdf/)
            .expect('Content-Disposition', 'attachment; filename=invoice.pdf')
            .expect((res) => {
                // checking if it is a pdf file
                assert.equal( res.text.indexOf('%PDF-1.4'), 0, 'The metadata is not pdf' );
            })
            .end(done);
    });

    it('respond with 400 if empty body', function(done) {
        request(app)
            .post('/pdf')
            .set('Content-Type', 'text/plain')
            .set('Accept', 'application/pdf')
            .send('')
            .expect(400, {
                msg: 'request body should contain html'
            })
            .end(done);
    });
});