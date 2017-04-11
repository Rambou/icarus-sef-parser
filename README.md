# Icarus-Sef parser
[![GitHub version](https://badge.fury.io/gh/rambou%2Ficarus-sef-parser.svg)](https://badge.fury.io/gh/rambou%2Ficarus-sef-parser) [![npm version](https://badge.fury.io/js/icarus-sef-parser.svg)](https://badge.fury.io/js/icarus-sef-parser) [![npm](https://img.shields.io/npm/dt/rambou.svg)]() [![npm](https://img.shields.io/npm/l/icarus-sef-parser.svg)]() [![GitHub issues](https://img.shields.io/github/issues/rambou/icarus-sef-parser.svg)]() [![Libraries.io for GitHub](https://img.shields.io/librariesio/github/rambou/icarus-sef-parser.svg)]() [![GitHub stars](https://img.shields.io/github/stars/Rambou/icarus-sef-parser.svg)](https://github.com/Rambou/icarus-sef-parser/stargazers) [![GitHub forks](https://img.shields.io/github/forks/Rambou/icarus-sef-parser.svg)](https://github.com/Rambou/icarus-sef-parser/network) [![GitHub issues](https://img.shields.io/github/issues/Rambou/icarus-sef-parser.svg)](https://github.com/Rambou/icarus-sef-parser/issues) [![Build Status](https://travis-ci.org/Rambou/icarus-sef-parser.svg?branch=master)](https://travis-ci.org/Rambou/icarus-sef-parser)[![Coverage Status](https://coveralls.io/repos/github/Rambou/icarus-sef-parser/badge.svg)](https://coveralls.io/github/Rambou/icarus-sef-parser) [![codecov](https://codecov.io/gh/Rambou/icarus-sef-parser/branch/master/graph/badge.svg)](https://codecov.io/gh/Rambou/icarus-sef-parser) [![Code Climate](https://codeclimate.com/github/Rambou/icarus-sef-parser/badges/gpa.svg)](https://codeclimate.com/github/Rambou/icarus-sef-parser) [![Issue Count](https://codeclimate.com/github/Rambou/icarus-sef-parser/badges/issue_count.svg)](https://codeclimate.com/github/Rambou/icarus-sef-parser) [![Twitter](https://img.shields.io/twitter/url/https/github.com/Rambou/icarus-sef-parser.svg?style=social)](https://twitter.com/intent/tweet?text=Wow:&url=%5Bobject%20Object%5D) [![Dependency Status](https://david-dm.org/rambou/icarus-sef-parser.svg)](https://david-dm.org/rambou/icarus-sef-parser) [![devDependency Status](https://david-dm.org/rambou/icarus-sef-parser/dev-status.svg)](https://david-dm.org/rambou/icarus-sef-parser?type=dev) [![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

A simple module to parse https://icarus-icsd.aegean.gr and https://sef.math.aegean.gr websites to get students marks or send requests to each department's office. This currently only works with icarus and sef. In the future i'm gonna add functionality for all the departments of the Aegean University.

[![NPM](https://nodei.co/npm/icarus-sef-parser.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/icarus-sef-parser/)

## Install

```
npm install --save icarus-sef-parser
```
## How to use

Create a new object of parser and give username and password to initialize.
```javascript
require('icarus-sef-parser');

var parser = new auth(USERNAME, PASSWORD);
```

Below is an example of how to use some of the api functionality.
```javascript
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
        address2: 'test',
        address: 'test',
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
```
## Coding Activity
[![wakatime](https://wakatime.com/share/@rambou/ca298f4e-3d1a-4d87-a4b1-ae7c62599429.svg)](https://wakatime.com/@rambou/projects/jqaggxtoch)
