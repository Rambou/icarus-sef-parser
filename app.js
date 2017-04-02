var request = require('request');
var charsetParser = require('charset-parser');
var iconv = require('iconv-lite');
var jsdom = require("jsdom");
var mongoose = require('mongoose');
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
var object = new auth(USERNAME, PASSWORD);

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
