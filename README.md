# Icarus-Sef parser
[![GitHub version](https://badge.fury.io/gh/rambou%2Ficarus-sef-parser.svg)](https://badge.fury.io/gh/rambou%2Ficarus-sef-parser) [![npm version](https://badge.fury.io/js/icarus-sef-parser.svg)](https://badge.fury.io/js/icarus-sef-parser) [![npm](https://img.shields.io/npm/dt/rambou.svg)]() [![npm](https://img.shields.io/npm/l/icarus-sef-parser.svg)]() [![GitHub issues](https://img.shields.io/github/issues/rambou/icarus-sef-parser.svg)]() [![Libraries.io for GitHub](https://img.shields.io/librariesio/github/rambou/icarus-sef-parser.svg)]() [![GitHub stars](https://img.shields.io/github/stars/Rambou/icarus-sef-parser.svg)](https://github.com/Rambou/icarus-sef-parser/stargazers) [![GitHub forks](https://img.shields.io/github/forks/Rambou/icarus-sef-parser.svg)](https://github.com/Rambou/icarus-sef-parser/network) [![GitHub issues](https://img.shields.io/github/issues/Rambou/icarus-sef-parser.svg)](https://github.com/Rambou/icarus-sef-parser/issues) [![Build Status](https://travis-ci.org/Rambou/icarus-sef-parser.svg?branch=master)](https://travis-ci.org/Rambou/icarus-sef-parser)[![Coverage Status](https://coveralls.io/repos/github/Rambou/icarus-sef-parser/badge.svg)](https://coveralls.io/github/Rambou/icarus-sef-parser) [![codecov](https://codecov.io/gh/Rambou/icarus-sef-parser/branch/master/graph/badge.svg)](https://codecov.io/gh/Rambou/icarus-sef-parser) [![Twitter](https://img.shields.io/twitter/url/https/github.com/Rambou/icarus-sef-parser.svg?style=social)](https://twitter.com/intent/tweet?text=Wow:&url=%5Bobject%20Object%5D)

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
});
```
