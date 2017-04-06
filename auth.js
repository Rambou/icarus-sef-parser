// import dependencies
var request = require('request'),
    charsetParser = require('charset-parser'),
    iconv = require('iconv-lite'),
    jsdom = require("jsdom");

// skip iconv warnings
// TODO: Fix this issue with the buffer
iconv.skipDecodeWarning = true;

var DEPART = {
    MPES: {
        url: 'https://icarus-icsd.aegean.gr',
        main_url: 'student_main.php',
        name: "Μηχανικών Πληροφοριακών και Επικοινωνιακών συστημάτων"
    },
    MATH: {url: 'https://sef.samos.aegean.gr/', main_url: 'main.php', name: "Μαθηματικό"},
    SAXM: {url: 'https://sef.samos.aegean.gr/', main_url: 'main.php', name: "Στατιστική"},
};
var self;

// Constructor
function Authenticate(username, password) {
    // always initialize all instance properties
    this.username = username;
    this.password = password;
    this.cookie = null;

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

    // initiate self for access inside callbacks
    self = this;
}

// class methods
Authenticate.prototype.printStudent = function () {
    console.log("Όνομα χρήστη: " + this.username + ", Τμήμα: " + this.department.name + ", URL συστήματος: " + this.department.url)
};

Authenticate.prototype.getDepartmentName = function () {
    return this.department.name;
};

Authenticate.prototype.getAnalyticGrades = function (document, callback) {
    var courses = [];

    try {
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

                //console.log("ID: " + ID + ", Title:" + Title + ", Cemester:" + Cemester + ", Mark: " + Mark + ", ApplyDate:" + ApplyDate + ", ExamDate:" + ExamDate + ", Status: " + Status)
                courses.push({
                    id: ID,
                    title: Title,
                    cemester: Cemester,
                    applyDate: ApplyDate,
                    examDate: ExamDate,
                    mark: Mark,
                    status: Status
                });
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

                //console.log("ID: " + ID + ", Title:" + Title + ", ApplyDate:" + ApplyDate + ((ExamDate.trim()) ? ", ExamDate: " + ExamDate : "") + ((Mark) ? ", Mark:" + Mark : "") + ", Status:" + Status)
                courses.push({
                    id: ID,
                    title: Title,
                    applyDate: ApplyDate,
                    examDate: ExamDate,
                    mark: Mark,
                    status: Status
                });
            });
        }

        return callback(null, courses)
    } catch (err) {
        return callback(err, null)
    }
}

Authenticate.prototype.getSucceededGrades = function (document, callback) {
    var courses = [];

    try {
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

                //console.log("ID: " + ID + ", Title:" + Title + ", Cemester:" + Cemester + ", Mark: " + Mark + ", ApplyDate:" + ApplyDate + ", ExamDate:" + ExamDate + ", Status: " + Status)
                courses.push({
                    id: ID,
                    title: Title,
                    cemester: Cemester,
                    applyDate: ApplyDate,
                    examDate: ExamDate,
                    mark: Mark,
                    status: Status
                });
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

                /*console.log("ID: " + ID + ", Title:" + Title +
                 ((ECTS) ? ", ECTS:" + ECTS : "") +
                 ((Certificate) ? ", Certificate:" + Certificate : "") +
                 ", ApplyDate:" + ApplyDate +
                 ((ExamDate.trim()) ? ", ExamDate: " + ExamDate : "") +
                 ", Mark:" + Mark + ", Status:" + Status)*/
                courses.push({
                    id: ID,
                    title: Title,
                    ects: ECTS,
                    certificate: Certificate,
                    applyDate: ApplyDate,
                    examDate: ExamDate,
                    mark: Mark,
                    status: Status
                });
            });
        }

        return callback(null, courses)
    } catch (err) {
        return callback(err, null)
    }
};

Authenticate.prototype.getExamGrades = function (document, callback) {
    var courses = [];

    try {
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

                // console.log("ID: " + ID + ", Title:" + Title + ", Cemester:" + Cemester + ((Mark.trim()) ? ", Mark: " + Mark : "") + ", ApplyDate:" + ApplyDate + ((ExamDate.trim()) ? ", ExamDate: " + ExamDate : "") + ", Status: " + Status)
                courses.push({
                    id: ID,
                    title: Title,
                    cemester: Cemester,
                    applyDate: ApplyDate,
                    examDate: ExamDate,
                    mark: Mark,
                    status: Status
                });
            });
        }
    } catch (err) {
        return callback(err, null)
    }

};

Authenticate.prototype.getIntercalaryExamGrades = function (document, callback) {
    var courses = [];

    try {
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

                // console.log("ID: " + ID + ", Title:" + Title + ", Cemester:" + Cemester + ((Mark.trim()) ? ", Mark: " + Mark : "") + ", ApplyDate:" + ApplyDate + ((ExamDate.trim()) ? ", ExamDate: " + ExamDate : "") + ", Status: " + Status)
                courses.push({
                    id: ID,
                    title: Title,
                    cemester: Cemester,
                    applyDate: ApplyDate,
                    examDate: ExamDate,
                    mark: Mark,
                    status: Status
                });
            });
        }
    } catch (err) {
        return callback(err, null)
    }

};

Authenticate.prototype.getUserDetails = function (document, cookie, callback) {
    if (this.department == DEPART.MPES) {
        try {
            var student_name = document.querySelector('#header_login u').innerHTML;
            var student_id = document.querySelector('#tabs-1 h2').innerHTML.replace('Μητρώο φοιτητή: ', '').replace(/ -.*/i, '').trim();
            var status = document.querySelector('#tabs-1 h2').innerHTML.replace(/.*Κατάσταση:/ig, '').trim();

            //console.log('AM: ' + student_id + ', Name: ' + student_name + ", Κατάσταση: " + status);
            return callback(null, {id: student_id, name: student_name, status: status});
        } catch (err) {
            var err = new Error('Probably unauthenticated or icarus page changed.');
            return callback(err)
        }
    } else {
        request({
            url: this.department.url + '/request.php',
            method: 'GET',
            headers: {'Cookie': cookie}
        }, function (error, response, body) {
            if (error) {
                console.log('error:', error); // Print the error if one occurred
                return callback(error)
            }

            // parse html
            var doc = jsdom.jsdom(body);

            try {
                var student_id = doc.querySelector('input[name="am"]').value;
                var student_name = doc.querySelector('input[name="fname"]').value;
                +doc.querySelector('input[name="sname"]').value;
                var fathername = doc.querySelector('input[name="father"]').value;
                var address = doc.querySelector('input[name="address"]').value;
                var phone = doc.querySelector('input[name="emergency"]').value;

                //console.log('AM: ' + student_id + ', Name: ' + student_name + ", Father: " + fathername + ", address: " + address + ", phone: " + phone);
                return callback(null, {
                    id: student_id,
                    name: student_name,
                    father: fathername,
                    address: address,
                    phone: phone
                });
            } catch (err) {
                var err = new Error('Probably unauthenticated or sef page changed.');
                return callback(err)
            }
        });
    }
};

Authenticate.prototype.getCookie = function (callback) {
    request({
        url: this.department.url + '/authentication.php',
        form: JSON.parse('{ "username": "' + this.username + '", "' + ((this.department == DEPART.MPES) ? "pwd" : "password") + '": "' + this.password + '" }'),
        method: 'POST'
    }, function (error, response) {
        if (error) {
            console.log('error:', error); // Print the error if one occurred
            return callback(error, null);
        }

        // get the session cookie
        var cookie = response.headers['set-cookie'];
        // set cookie in class
        this.cookie = cookie;

        return callback(null, cookie);
    })
};

Authenticate.prototype.authenticate = function (callback) {
    this.getCookie(function (error, cookie) {
        if (error)
            return callback(error, null);

        // check if logged in
        request({
            url: self.department.url + '/' + self.department.main_url,
            method: 'GET',
            headers: {'Cookie': cookie},
            encoding: 'binary',
            body: 'buffer'
        }, function (error, response, body) {
            if (error) {
                console.log('error:', error); // Print the error if one occurred
                return callback(error, null);
            }

            // parse charset
            var charset = charsetParser(body);

            // decode binary with charset
            var decodedBody = iconv.decode(body, charset);

            //remove comments correct & symbol (encoding issues)
            decodedBody = decodedBody.replace(/<!--[\s\S]/g, '').replace(/&/g, 'και');

            // parse html
            var document = jsdom.jsdom(decodedBody);

            var status;

            // check which department are we looking for
            if (self.department == DEPART.MPES) {
                var student_name = document.querySelector('#header_login u').innerHTML;

                // check if student name exists, that indicates if user is loggedin.
                status = (student_name.trim()) ? true : false;
            } else {
                var loginbox = document.querySelector('.login-box');

                // check to see if login-box exists else user is logged in
                status = (loginbox) ? false : true;
            }

            return callback(null, {authenticated: status, document: document, cookie: cookie});
        });

    })
};

Authenticate.prototype.getSessionInfo = function () {
    return {username: this.username, department: this.department}
};

Authenticate.prototype.getCurriculumToDeclare = function (cookie, callback) {

    request({
        url: this.department.url + '/student_dilosi.php', method: 'GET',
        headers: {'Cookie': cookie},
        encoding: 'binary',
        body: 'buffer'
    }, function (error, response, body) {
        if (error) {
            console.log('error:', error); // Print the error if one occurred
            return callback(error, null);
        }

        if (self.department !== DEPART.MPES) {
            return callback(new Error('getCurriculumToDeclare() Only works with ' + DEPART.MPES.name), null)
        }

        // parse charset
        var charset = charsetParser(body);

        // decode binary with charset
        var decodedBody = iconv.decode(body, charset);

        //remove comments correct & symbol (encoding issues)
        decodedBody = decodedBody.replace(/&/g, 'και');

        // parse html
        var document = jsdom.jsdom(decodedBody);

        var courses = [];

        document.querySelectorAll('table tr').forEach(function (tr) {

            var td = tr.querySelectorAll('td');

            // check if something is undefined and continue to next iteration
            if (td[2] == null || td[3] == null || td[4] == null || td[5] == null || td[6] == null)
                return;

            // parse data
            var ID = td[2].innerHTML;
            var Title = td[3].innerHTML;
            var Cycle;
            switch (parseInt(td[4].innerHTML.trim())) {
                case 1:
                    Cycle = 'Ασφάλεια Πληροφοριακών και Επικοινωνιακών Συστημάτων και Ιδιωτικότητα';
                    break;
                case 2:
                    Cycle = 'Πληροφοριακά Συστήματα και Επιχειρηματικότητα';
                    break;
                case 3:
                    Cycle = 'Τεχνολογίες Υπολογιστών και Τηλεπικοινωνιών';
                    break;
                case 4:
                    Cycle = 'Επικοινωνιακά Συστήματα και Δίκτυα';
                    break;
                case 5:
                    Cycle = 'Διαχείριση Πληροφορίας και Ευφυή Συστήματα';
                    break;
                case 6:
                    Cycle = 'Θεμελιώσεις της Επιστήμης των Υπολογιστών';
                    break;
                default:
                    break;
            }
            var Type = td[5].innerHTML;
            var ECTS = td[6].innerHTML;

            courses.push(JSON.parse('{ "id": "' + ID + '", "' +
                'title": "' + Title + '", "' +
                ((Cycle) ? 'cycle": "' + Cycle + '", "' : "") +
                'type": "' + Type + '", "' +
                'ects": "' + ECTS + '"}'));
        });

        return callback(null, courses)
    })
};

Authenticate.prototype.postCurriculumToDeclare = function (courses, cookie, callback) {
    var formData = {};
    formData["count_lessons_etous"] = "1";
    formData["continue"] = "1";
    for (var i in courses) {
        formData["new_lesson_ids[" + i + "]"] = courses[i];
    }

    request({
        url: this.department.url + '/student_dilosi.php',
        formData: formData,
        method: 'POST',
        headers: {'Cookie': cookie}
    }, function (error, response) {
        if (error) {
            console.log('error:', error); // Print the error if one occurred
            return callback(error, null);
        }

        if (self.department !== DEPART.MPES) {
            return callback(new Error('postCurriculumToDeclare() Only works with ' + DEPART.MPES.name), null)
        }

        return callback(null, response)
    });
};

// export the class
module.exports = Authenticate;
