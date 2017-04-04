// get the application server module
var parser = require('./auth.js');
var assert = require('chai').assert;
var expect = require('chai').expect;
var config = require('config');

const USERNAME_SEF = (process.env.USERNAME_SEF) ?
    process.env.USERNAME_SEF :
    config.get('sef.username');
const PASSWORD_SEF = (process.env.PASSWORD_SEF) ?
    (process.env.PASSWORD_SEF) :
    config.get('sef.password');
const USERNAME_ICARUS = (process.env.USERNAME_ICARUS) ?
    (process.env.USERNAME_ICARUS) :
    config.get('sef.username');
const PASSWORD_ICARUS = (process.env.PASSWORD_ICARUS) ?
    (process.env.PASSWORD_ICARUS) :
    config.get('sef.password');

describe('Module', function () {

    it('should throw error on wrong username', function () {
        assert.throw(function () {
            new parser('worng_username', '')
        }, Error);
    })
});

describe('Icarus Parser', function () {

    var self = this;

    before(function () {
        expect(USERNAME_ICARUS).to.exist;
        expect(PASSWORD_ICARUS).to.exist;
        this.parser = new parser(USERNAME_ICARUS, PASSWORD_ICARUS);
    });

    it('should only test in the MPES department', function () {
        expect(this.parser.getDepartmentName()).equals('Μηχανικών Πληροφοριακών και Επικοινωνιακών συστημάτων');
        expect(this.parser.getSessionInfo().username).equals(USERNAME_ICARUS);
    });

    it('should authenticate', function (done) {
        this.timeout(10000);
        this.parser.authenticate(function (err, response) {
            expect(err).to.not.exist;
            expect(response).to.exist;

            expect(response.authenticated).to.be.true;
            expect(response.document).to.not.be.null;
            expect(response.cookie).to.not.be.null;

            self.cookie = response.cookie;
            self.document = response.document;

            done();
        });
    });

    it('should not authenticate user with wrong credentials', function (done) {
        this.timeout(10000);
        var parser_wrong = new parser(USERNAME_ICARUS, 'wrong_password');
        parser_wrong.authenticate(function (err, response) {
            expect(err).to.not.exist;
            expect(response).to.exist;

            expect(response.authenticated).to.be.false;
            expect(response.cookie).not.to.be.null;

            done();
        });
    });

    it('should return analytic grades', function (done) {
        expect(self.document).to.exist;
        this.parser.getAnalyticGrades(self.document, function (err, response) {
            expect(err).to.not.exist;
            expect(response).to.exist;

            expect(response).to.have.length.above(2);
            expect(response[0]).to.have.deep.property('id');
            expect(response[0]).to.have.deep.property('title');
            expect(response[0]).to.have.deep.property('cemester');
            expect(response[0]).to.have.deep.property('applyDate');
            expect(response[0]).to.have.deep.property('examDate');
            expect(response[0]).to.have.deep.property('mark');
            expect(response[0]).to.have.deep.property('status');

            done();
        })
    });

    it('should return succeeded grades', function (done) {
        expect(self.document).to.exist;
        this.parser.getSucceededGrades(self.document, function (err, response) {
            expect(err).to.not.exist;
            expect(response).to.exist;

            expect(response).to.have.length.above(2);
            expect(response[0]).to.have.deep.property('id');
            expect(response[0]).to.have.deep.property('title');
            expect(response[0]).to.have.deep.property('cemester');
            expect(response[0]).to.have.deep.property('applyDate');
            expect(response[0]).to.have.deep.property('examDate');
            expect(response[0]).to.have.deep.property('mark');
            expect(response[0]).to.have.deep.property('status');

            done();
        })
    })

});

describe('Sef Parser', function () {

    var self = this;

    before(function () {
        expect(USERNAME_SEF).to.exist;
        expect(PASSWORD_SEF).to.exist;
        this.parser = new parser(USERNAME_SEF, PASSWORD_SEF);
    });

    it('should only test in the MATH or SAXM department', function () {
        expect(this.parser.getDepartmentName()).equals('Μαθηματικό');
        expect(this.parser.getSessionInfo().username).equals(USERNAME_SEF);
    });

    it('should authenticate', function (done) {
        this.timeout(10000);
        this.parser.authenticate(function (err, response) {
            expect(err).to.not.exist;
            expect(response).to.exist;

            expect(response.authenticated).to.be.true;
            expect(response.document).to.not.be.null;
            expect(response.cookie).to.not.be.null;

            self.cookie = response.cookie;
            self.document = response.document;

            done();
        });
    });

    it('should not authenticate user with wrong credentials', function (done) {
        this.timeout(10000);
        var parser_wrong = new parser(USERNAME_SEF, 'wrong_password');
        parser_wrong.authenticate(function (err, response) {
            expect(err).to.not.exist;
            expect(response).to.exist;

            expect(response.authenticated).to.be.false;

            done();
        });
    });

    it('should return analytic grades', function (done) {
        expect(self.document).to.exist;
        this.parser.getAnalyticGrades(self.document, function (err, response) {
            expect(err).to.not.exist;
            expect(response).to.exist;

            done();
        })
    })

});

