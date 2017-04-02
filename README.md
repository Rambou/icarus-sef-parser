# Icarus-Sef parser
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
