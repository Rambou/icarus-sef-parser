var auth = require('./auth.js');
var config = require('config');

const USERNAME = (process.env.USERNAME) ?
    process.env.USERNAME :
    config.get('icarus.username');
const PASSWORD = (process.env.PASSWORD) ?
    (process.env.PASSWORD) :
    config.get('icarus.password');
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
    parser.getCurriculumToDeclare(response.cookie, function (err, value) {
        if (err) {
            console.log('error:', err.message); // Print the error if one occurred
        }

        var formData = [];
        for (var i in value) {
            formData.push(value[i].id);
        }

        console.log(value)

        // call postCurriculumToDeclare(formData,  (err, value) {....}) to post them
    });
    parser.postCurriculumToDeclare(['321-2450',
        '331-2205',
        '321-4120',
        '311-0116',
        '311-0238',
        '311-0327',
        '311-0437',
        '331-2708'], response.cookie, function (err, value) {
        if (err) {
            console.log('error:', err.message); // Print the error if one occurred
        }

        console.log(value);
    });
    parser.postRequestToDepartment({
        id: 'test',
        surname: 'test',
        name: 'test',
        father: 'test',
        semester: 'test',
        address: 'test',
        address2: 'test',
        phone: 'test',
        emergency: 'test',
        method: 'test',
        sent_address: 'test',
        other: 'test',
        requests: [
            {name: 'Βεβαίωση Σπουδών', amount: '1'},
            {name: 'Βεβαίωση Διαγραφής', amount: '3'},
            {name: 'Αλλο', amount: '9', what: 'κάτι άλλο'}
        ]
    }, response.cookie, function (err, value) {
        if (err) {
            console.log('error:', err.message); // Print the error if one occurred
        }

        console.log(value);
    })
});
