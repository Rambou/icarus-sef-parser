var auth = require('./auth.js');
var config = require('config');

const USERNAME = (process.env.USERNAME) ?
    process.env.USERNAME :
    config.get('username');
const PASSWORD = (process.env.PASSWORD) ?
    (process.env.PASSWORD) :
    config.get('password');
const MONGO_URI = (process.env.MONGO_URI) ?
    (process.env.MONGO_URI) :
    config.get('mongo_uri');

if (!(USERNAME && PASSWORD && MONGO_URI)) {
    console.error("Missing config values");
    process.exit(1);
}

// constructor call
var parser = new auth(USERNAME, PASSWORD);

// execute and test module
parser.printStudent();
console.log(parser.getSessionInfo());
console.log(parser.getDepartmentName());

// authenticate and test the other api
parser.authenticate(function (error, response) {
    console.log(response);
    console.log((response.authenticated) ? "Authenticated" : "Authentication Failed.");

    parser.getUserDetails(response.document, response.cookie, function (err, data) {
        if (err) {
            return console.log(err.message)
        }
        console.log(data)
    });
    parser.getSucceededGrades(response.document, function (err, value) {
        if (err) {
            return console.log(err.message)
        }
        console.log(value)
    });
    parser.getAnalyticGrades(response.document, function (err, value) {
        if (err) {
            return console.log(err.message)
        }
        console.log(value)
    });
    parser.getExamGrades(response.document, function (err, value) {
        if (err) {
            return console.log(err.message)
        }
        console.log(value)
    });
    parser.getIntercalaryExamGrades(response.document, function (err, value) {
        if (err) {
            return console.log(err.message)
        }
        console.log(value)
    });

});
