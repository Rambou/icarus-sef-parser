# Icarus-Sef parser
[![GitHub version](https://badge.fury.io/gh/rambou%2Ficarus-sef-parser.svg)](https://badge.fury.io/gh/rambou%2Ficarus-sef-parser) [![codecov](https://codecov.io/gh/Rambou/icarus-sef-parser/branch/master/graph/badge.svg)](https://codecov.io/gh/Rambou/icarus-sef-parser) [![npm version](https://badge.fury.io/js/icarus-sef-parser.svg)](https://badge.fury.io/js/icarus-sef-parser) [![npm](https://img.shields.io/npm/dt/rambou.svg)]() [![npm](https://img.shields.io/npm/l/icarus-sef-parser.svg)]() [![GitHub issues](https://img.shields.io/github/issues/rambou/icarus-sef-parser.svg)]() [![Libraries.io for GitHub](https://img.shields.io/librariesio/github/rambou/icarus-sef-parser.svg)]()
[![Twitter](https://img.shields.io/twitter/url/https/github.com/Rambou/icarus-sef-parser.svg?style=social)](https://twitter.com/intent/tweet?text=Wow:&url=%5Bobject%20Object%5D) [![GitHub stars](https://img.shields.io/github/stars/Rambou/icarus-sef-parser.svg)](https://github.com/Rambou/icarus-sef-parser/stargazers) [![GitHub forks](https://img.shields.io/github/forks/Rambou/icarus-sef-parser.svg)](https://github.com/Rambou/icarus-sef-parser/network) [![GitHub issues](https://img.shields.io/github/issues/Rambou/icarus-sef-parser.svg)](https://github.com/Rambou/icarus-sef-parser/issues)
A simple module to parse https://icarus-icsd.aegean.gr and https://sef.math.aegean.gr websites to get students marks or send requests to office.

## How to use

Create a new object
```
require('icarus-sef-parser');

var object = new auth(USERNAME, PASSWORD);
```
test some of the methods
```
// execute and test module
object.printStudent();
console.log(object.getDepartmentName());
object.getCookie(function (cookie) {
    console.log(cookie)
    object.printAnalyticGrades(cookie.document)
    object.printSucceededGrades(cookie.document)
    object.printExamGrades(cookie.document)
    object.printIntercalaryExamGrades(cookie.document)
    object.getUserDetails(cookie.document, cookie.cookie)
})
```
