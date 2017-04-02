var request = require('request');
var charsetParser = require('charset-parser');
var iconv = require('iconv-lite');
var jsdom = require("jsdom");

var DEPART = {
    MPES: {
        url: 'https://icarus-icsd.aegean.gr',
        main_url: 'student_main.php',
        name: "Μηχανικών Πληροφοριακών και Επικοινωνιακών συστημάτων"
    },
    MATH: {url: 'https://sef.samos.aegean.gr/', main_url: 'main.php', name: "Μαθηματικό"},
    SAXM: {url: 'https://sef.samos.aegean.gr/', main_url: 'main.php', name: "Στατιστική"},
};
var department;

// Constructor
function Authenticate(username, password) {
    // always initialize all instance properties
    this.username = username;
    this.password = password;

    // check department and website
    if (username.indexOf('icsd') > -1) {
        this.department = DEPART.MPES;
    } else if (username.indexOf('math') > -1) {
        this.department = DEPART.MATH;
    } else if (username.indexOf('sas') > -1) {
        this.department = DEPART.SAXM;
    } else {
        throw new Error("Not a valid user!");
    }
    department = this.department;
}

// class methods
Authenticate.prototype.printStudent = function () {
    console.log("Όνομα χρήστη: " + this.username + ", Τμήμα: " + this.department.name + ", URL συστήματος: " + this.department.url)
};

Authenticate.prototype.getDepartmentName = function () {
    return this.department.name;
};

Authenticate.prototype.getCookie = function (callback) {
    request({
        url: this.department.url + '/authentication.php',
        form: JSON.parse('{ "username": "' + this.username + '", "' + ((this.department == DEPART.MPES) ? "pwd" : "password") + '": "' + this.password + '" }'),
        method: 'POST'
    }, function (error, response, body) {
        if (error) {
            console.log('error:', error); // Print the error if one occurred
            throw error;
        }

        // get the session cookie
        var cookie = response.headers['set-cookie'];

        // check if logged in
        request({
            url: department.url + '/' + department.main_url,
            method: 'GET',
            headers: {'Cookie': cookie},
            encoding: 'binary'
        }, function (error, response, body) {
            if (error) {
                console.log('error:', error); // Print the error if one occurred
                throw error;
            }
            // parse charset
            var charset = charsetParser(body);
            // decode binary with charset
            var html = iconv.decode(body, ((department == DEPART.MPES) ? 'iso-8859-7' : 'utf-8'));
            //remove comments
            html = html.replace(/<!--[\s\S]/g, '');
            // parse html
            var document = jsdom.jsdom(html);

            // check which department are we looking for
            if (department == DEPART.MPES) {
                var student_name = document.querySelector('#header_login u').innerHTML;

                // check if student name exists, that indicates if user is loggedin.
                if (student_name.trim()) {
                    callback({cookie: cookie, document: document});
                } else {
                    callback(null);
                }
            } else {
                var loginbox = document.querySelector('.login-box');

                // check to see if login-box exists else user is logged in
                if (loginbox) {
                    callback(null);
                } else {
                    callback({cookie: cookie, document: document});
                }
            }

        });

    });
};

Authenticate.prototype.printAnalyticGrades = function (document) {
    if (this.department == DEPART.MPES) {
        document.querySelectorAll('#analytic_grades tbody tr').forEach(function (tr) {
            var td = tr.querySelectorAll('td');
            var ID = td[1].innerHTML;
            var Title = td[2].innerHTML;
            var Mark = td[3].innerHTML;
            var Cemester = td[4].innerHTML;
            var ApplyDate = td[5].innerHTML;
            var ExamDate = td[6].innerHTML;
            var Status = td[7].innerHTML;

            console.log("ID: " + ID + ", Title:" + Title + ", Cemester:" + Cemester + ", Mark: " + Mark + ", ApplyDate:" + ApplyDate + ", ExamDate:" + ExamDate + ", Status: " + Status)
        });
    } else {
        document.querySelectorAll('#tab_1 tbody tr').forEach(function (tr) {
            var td = tr.querySelectorAll('td');
            var ID = td[0].innerHTML;
            var Title = td[1].innerHTML;
            var ApplyDate = td[2].querySelector('span').innerHTML;
            var ExamDate = td[3].querySelector('span').innerHTML;
            var Mark = td[4].innerHTML;
            var Status = td[5].innerHTML;

            console.log("ID: " + ID + ", Title:" + Title + ", ApplyDate:" + ApplyDate + ((ExamDate.trim()) ? ", ExamDate: " + ExamDate : "") + ((Mark) ? ", Mark:" + Mark : "") + ", Status:" + Status)
        });
    }
}

Authenticate.prototype.printSucceededGrades = function (document) {
    if (this.department == DEPART.MPES) {
        document.querySelectorAll('#succeeded_grades tbody tr').forEach(function (tr) {
            var td = tr.querySelectorAll('td');
            var ID = td[1].innerHTML;
            var Title = td[2].innerHTML;
            var Mark = td[3].innerHTML;
            var Cemester = td[4].innerHTML;
            var ApplyDate = td[5].innerHTML;
            var ExamDate = td[6].innerHTML;
            var Status = td[7].innerHTML;

            console.log("ID: " + ID + ", Title:" + Title + ", Cemester:" + Cemester + ", Mark: " + Mark + ", ApplyDate:" + ApplyDate + ", ExamDate:" + ExamDate + ", Status: " + Status)
        });

    } else {
        document.querySelectorAll('#example3 tbody tr').forEach(function (tr) {
            var td = tr.querySelectorAll('td');
            var ID = td[0].innerHTML;
            var Title = td[1].innerHTML;
            var ECTS = td[3].innerHTML;
            var Certificate = td[5].innerHTML;
            var ApplyDate = td[6].innerHTML;
            var ExamDate = td[7].innerHTML;
            var Mark = td[8].innerHTML;
            var Status = td[9].innerHTML;

            console.log("ID: " + ID + ", Title:" + Title +
                ((ECTS) ? ", ECTS:" + ECTS : "") +
                ((Certificate) ? ", Certificate:" + Certificate : "") +
                ", ApplyDate:" + ApplyDate +
                ((ExamDate.trim()) ? ", ExamDate: " + ExamDate : "") +
                ", Mark:" + Mark + ", Status:" + Status)
        });
    }
};

Authenticate.prototype.printExamGrades = function (document) {
    if (this.department == DEPART.MPES) {
        document.querySelectorAll('#exetastiki_grades tbody tr').forEach(function (tr) {

            var td = tr.querySelectorAll('td');
            var ID = td[1].innerHTML;
            var Title = td[2].innerHTML;
            var Mark = td[3].innerHTML;
            var Cemester = td[4].innerHTML;
            var ApplyDate = td[5].innerHTML;
            var ExamDate = td[6].innerHTML;
            var Status = td[7].innerHTML;

            console.log("ID: " + ID + ", Title:" + Title + ", Cemester:" + Cemester + ((Mark.trim()) ? ", Mark: " + Mark : "") + ", ApplyDate:" + ApplyDate + ((ExamDate.trim()) ? ", ExamDate: " + ExamDate : "") + ", Status: " + Status)
        });
    }

};

Authenticate.prototype.printIntercalaryExamGrades = function (document) {
    if (this.department == DEPART.MPES) {
        document.querySelectorAll('#exetastiki_grades_emvolimi tbody tr').forEach(function (tr) {

            var td = tr.querySelectorAll('td');
            var ID = td[1].innerHTML;
            var Title = td[2].innerHTML;
            var Mark = td[3].innerHTML;
            var Cemester = td[4].innerHTML;
            var ApplyDate = td[5].innerHTML;
            var ExamDate = td[6].innerHTML;
            var Status = td[7].innerHTML;

            console.log("ID: " + ID + ", Title:" + Title + ", Cemester:" + Cemester + ((Mark.trim()) ? ", Mark: " + Mark : "") + ", ApplyDate:" + ApplyDate + ((ExamDate.trim()) ? ", ExamDate: " + ExamDate : "") + ", Status: " + Status)
        });
    }

};

Authenticate.prototype.getUserDetails = function (document, cookie) {
    if (this.department == DEPART.MPES) {
        var student_name = document.querySelector('#header_login u').innerHTML;
        var student_id = document.querySelector('#tabs-1 h2').innerHTML.replace('Μητρώο φοιτητή: ', '').replace(/ -.*/i, '').trim();
        var status = document.querySelector('#tabs-1 h2').innerHTML.replace(/.*Κατάσταση:/ig, '').trim();

        console.log('AM: ' + student_id + ', Name: ' + student_name + ", Κατάσταση: " + status);
    } else {
        request({
            url: this.department.url + '/request.php',
            method: 'GET',
            headers: {'Cookie': cookie}
        }, function (error, response, body) {
            if (error) {
                console.log('error:', error); // Print the error if one occurred
                throw error;
            }

            // parse html
            var doc = jsdom.jsdom(body);

            var info = doc.querySelectorAll('#box-body input');
            var student_id = doc.querySelector('input[name="am"]').value;
            var student_name = doc.querySelector('input[name="fname"]').value;
            +doc.querySelector('input[name="sname"]').value;
            var fathername = doc.querySelector('input[name="father"]').value;
            var address = doc.querySelector('input[name="address"]').value;
            var phone = doc.querySelector('input[name="emergency"]').value;

            console.log('AM: ' + student_id + ', Name: ' + student_name + ", Father: " + fathername + ", address: " + address + ", phone: " + phone);

        });
    }
};

// export the class
module.exports = Authenticate;
