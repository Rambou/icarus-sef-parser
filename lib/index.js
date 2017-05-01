// import dependencies
var request = require('request'),
    charsetParser = require('charset-parser'),
    iconv = require('iconv-lite'),
    jsdom = require("jsdom");

const {JSDOM} = jsdom;

// skip iconv warnings
// TODO: Fix this issue with the buffer
iconv.skipDecodeWarning = true;

var DEPART = {
    MPES: {
        url: 'https://icarus-icsd.aegean.gr',
        main_url: 'student_main.php',
        request_url: 'student_aitisi.php',
        name: "Μηχανικών Πληροφοριακών και Επικοινωνιακών συστημάτων"
    },
    MATH: {url: 'https://sef.samos.aegean.gr/', main_url: 'main.php', request_url: 'request.php', name: "Μαθηματικό"},
    SAXM: {url: 'https://sef.samos.aegean.gr/', main_url: 'main.php', request_url: 'request.php', name: "Στατιστική"}
};
var self;

// Constructor
function Parser(username, password) {
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
Parser.prototype.printStudent = function () {
    console.log("Όνομα χρήστη: " + this.username + ", Τμήμα: " + this.department.name + ", URL συστήματος: " + this.department.url)
};

Parser.prototype.getDepartmentName = function () {
    return this.department.name;
};

Parser.prototype.getAnalyticGrades = function (document, callback) {
    var courses = [];

    try {
        if (this.department === DEPART.MPES) {
            document.window.document.querySelectorAll('#analytic_grades tbody tr').forEach(function (tr) {
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
            document.window.document.querySelectorAll('#tab_1 tbody tr').forEach(function (tr) {
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

Parser.prototype.getSucceededGrades = function (document, callback) {
    var courses = [];

    try {
        if (this.department === DEPART.MPES) {
            document.window.document.querySelectorAll('#succeeded_grades tbody tr').forEach(function (tr) {
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
            document.window.document.querySelectorAll('#example3 tbody tr').forEach(function (tr) {
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

Parser.prototype.getExamGrades = function (document, callback) {
    var courses = [];

    try {
        if (this.department === DEPART.MPES) {
            document.window.document.querySelectorAll('#exetastiki_grades tbody tr').forEach(function (tr) {

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

Parser.prototype.getIntercalaryExamGrades = function (document, callback) {
    var courses = [];

    try {
        if (this.department === DEPART.MPES) {
            document.window.document.querySelectorAll('#exetastiki_grades_emvolimi tbody tr').forEach(function (tr) {

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

Parser.prototype.getUserDetails = function (document, cookie, callback) {
    if (this.department === DEPART.MPES) {
        try {
            var student_name = document.window.document.querySelector('#header_login u').innerHTML;
            var student_id = document.window.document.querySelector('#tabs-1 h2').innerHTML.replace('Μητρώο φοιτητή: ', '').replace(/ -.*/i, '').trim();
            var status = document.window.document.querySelector('#tabs-1 h2').innerHTML.replace(/.*Κατάσταση:/ig, '').trim();

            //console.log('AM: ' + student_id + ', Name: ' + student_name + ", Κατάσταση: " + status);
            return callback(null, {id: student_id, name: student_name, status: status});
        } catch (err) {
            err.message = 'Probably unauthenticated or icarus page changed.';
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
            var doc = new JSDOM(body);

            try {
                var student_id = doc.window.document.querySelector('input[name="am"]').value;
                var student_name = doc.window.document.querySelector('input[name="fname"]').value + " " + doc.window.document.querySelector('input[name="sname"]').value;
                var fathername = doc.window.document.querySelector('input[name="father"]').value;
                var address = doc.window.document.querySelector('input[name="address"]').value;
                var phone = doc.window.document.querySelector('input[name="emergency"]').value;

                //console.log('AM: ' + student_id + ', Name: ' + student_name + ", Father: " + fathername + ", address: " + address + ", phone: " + phone);
                return callback(null, {
                    id: student_id,
                    name: student_name,
                    father: fathername,
                    address: address,
                    phone: phone
                });
            } catch (err) {
                err.message = 'Probably unauthenticated or icarus page changed.';
                return callback(err)
            }
        });
    }
};

Parser.prototype.getCookie = function (callback) {
    request({
        url: this.department.url + '/authentication.php',
        form: JSON.parse('{ "username": "' + this.username + '", "' + ((this.department === DEPART.MPES) ? "pwd" : "password") + '": "' + this.password + '" }'),
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

Parser.prototype.authenticate = function (callback) {
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
            var document = new JSDOM(decodedBody);

            var status;

            // check which department are we looking for
            if (self.department === DEPART.MPES) {
                var student_name = document.window.document.querySelector('#header_login u').innerHTML;

                // check if student name exists, that indicates if user is loggedin.
                status = (student_name.trim()) ? true : false;
            } else {
                var loginbox = document.window.document.querySelector('.login-box');

                // check to see if login-box exists else user is logged in
                status = (loginbox) ? false : true;
            }

            return callback(null, {authenticated: status, document: document, cookie: cookie});
        });

    });
};

Parser.prototype.getSessionInfo = function () {
    return {username: this.username, department: this.department};
};

Parser.prototype.getCurriculumToDeclare = function (cookie, callback) {

    request({
        url: this.department.url + '/student_dilosi.php', method: 'GET',
        headers: {'Cookie': cookie},
        encoding: 'binary'
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
        var document = new JSDOM(decodedBody);

        var courses = [];

        document.window.document.querySelectorAll('table tr').forEach(function (tr) {

            var td = tr.querySelectorAll('td');

            // check if something is undefined and continue to next iteration
            if (td[2] || td[3] || td[4] || td[5] || td[6]) {

                // parse data
                var ID = td[2].innerHTML;
                var Title = td[3].innerHTML;
                var Cycle;
                switch (parseInt(td[4].innerHTML.trim(), 10)) {
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
            }
        });

        return callback(null, courses)
    })
};

Parser.prototype.postCurriculumToDeclare = function (courses, cookie, callback) {
    var formData = {};

    if (this.department === DEPART.MPES) {
        formData.count_lessons_etous = "1";
        formData.continue = "1";
        for (var i in courses) {
            if (courses.hasOwnProperty(i)) {
                formData["new_lesson_ids[" + i + "]"] = courses[i];
            }
        }

        request({
            url: this.department.url + '/student_dilosi.php',
            formData: formData,
            method: 'POST',
            headers: {'Cookie': cookie},
            encoding: 'binary'
        }, function (error, response, body) {
            if (error) {
                console.log('error:', error); // Print the error if one occurred
                return callback(error, null);
            }

            if (self.department !== DEPART.MPES) {
                return callback(new Error('postCurriculumToDeclare() Only works with ' + DEPART.MPES.name), null);
            }

            // parse charset
            var charset = charsetParser(body);

            // decode binary with charset
            var decodedBody = iconv.decode(body, charset);

            // parse html
            var document = new JSDOM(decodedBody);

            return callback(null, decodedBody);
        });
    }

};

Parser.prototype.postRequestToDepartment = function (data, cookie, callback) {
    var formData = {};

    if (this.department === DEPART.MPES) {

        // check data
        if (data.id === null || data.surname === null ||
            data.name === null || data.father === null ||
            data.semester === null || data.address === null ||
            data.phone === null || data.method === null ||
            data.sent_address === null || data.requests === null)
            return callback(new Error("JSON data is in wrong format."), null);

        // prepare request
        formData["aitisi_student_id"] = data.id;
        formData["aitisi_surname"] = data.surname;
        formData["aitisi_name"] = data.name;
        formData["aitisi_father"] = data.father;
        formData["aitisi_semester"] = data.semester;
        formData["aitisi_address"] = data.address;
        formData["aitisi_phone"] = data.phone;
        formData["aitisi_send_method"] = data.method;
        formData["aitisi_send_address"] = data.sent_address;
        // initialize first so order may not change in JSON
        for (var i = 0; i < 11; i++) {
            formData["prints_no[" + i + "]"] = '0';
        }

        for (i in data.requests) {
            if (data.requests.hasOwnProperty(i)) {
                switch (data.requests[i].name) {
                    case 'Βεβαίωση Σπουδών':
                        formData["prints_no[0]"] = data.requests[i].amount;
                        break;
                    case 'Πιστοποιητικό Αναλυτικής Βαθμολογίας':
                        formData["prints_no[1]"] = data.requests[i].amount;
                        break;
                    case 'Πιστοποιητικό Αναλυτικής Βαθμολογίας Πτυχιούχου, με Βαθμό Πτυχίου':
                        formData["prints_no[2]"] = data.requests[i].amount;
                        break;
                    case 'Πιστοποιητικό Αναλυτικής Βαθμολογίας Πτυχιούχου, χωρίς Βαθμό Πτυχίου':
                        formData["prints_no[3]"] = data.requests[i].amount;
                        break;
                    case 'Βεβαίωση για την στρατολογία':
                        formData["prints_no[4]"] = data.requests[i].amount;
                        break;
                    case 'Βεβαίωση Διαγραφής':
                        formData["prints_no[5]"] = data.requests[i].amount;
                        break;
                    case 'Επικυρωμένο Αντίγραφο Πτυχίου':
                        formData["prints_no[6]"] = data.requests[i].amount;
                        break;
                    case 'Βεβαίωση ότι πληρώ προϋποθέσεις απόκτησης πτυχίου':
                        formData["prints_no[7]"] = data.requests[i].amount;
                        break;
                    case 'Βεβαίωση ότι συμμετείχα στο μάθημα : Πρακτική Ασκηση':
                        formData["prints_no[8]"] = data.requests[i].amount;
                        break;
                    case 'Πιστοποιητικό στεγαστικού επιδόματος':
                        formData["prints_no[9]"] = data.requests[i].amount;
                        break;
                    case 'Αλλο':
                        formData["prints_no[10]"] = data.requests[i].amount;
                        formData.aitisi_allo = data.requests[i].what;
                        break;
                    default:
                        break;
                }
            }
        }
        formData["send"] = 'send';
    } else {
        // check data
        if (data.requests === null || data.address === null ||
            data.address2 === null || data.id === null || data.emergency === null ||
            data.father === null || data.name === null || data.other === null ||
            data.surname === null)
            return callback(new Error("JSON data is in wrong format."), null);

        // prepare request
        formData = {
            am: data.id,
            sname: data.surname,
            fname: data.name,
            father: data.father,
            address: data.address,
            emergency: data.phone,
            address2: data.address2,
            other: data.method,
            otherTxt: '',
            sendMail: "sendMail"
        };

        for (var i in data.requests) {
            if (data.requests.hasOwnProperty(i)) {
                switch (data.requests[i].name) {
                    case 'Βεβαίωση Σπουδών':
                        formData.Analytiki = data.requests[i].amount;
                        break;
                    case 'Πιστοποιητικό Αναλυτικής Βαθμολογίας':
                        formData.Vevaiosi = data.requests[i].amount;
                        break;
                    case 'Βεβαίωση για την στρατολογία':
                        formData.VevaiosiArmy = data.requests[i].amount;
                        break;
                    case 'Βεβαίωση ότι πληρώ προϋποθέσεις απόκτησης πτυχίου χωρίς βαθμό πτυχίου':
                        formData.VevaiosiDegree = data.requests[i].amount;
                        break;
                    case 'Βεβαίωση ότι πληρώ προϋποθέσεις απόκτησης πτυχίου με βαθμό πτυχίου (*)':
                        formData.VevaiosiDegree_1 = data.requests[i].amount;
                        break;
                    case 'Βεβαίωση ότι συμμετείχα στο μάθημα : Πρακτική Ασκηση':
                        formData.VevaiosiPraktiki = data.requests[i].amount;
                        break;
                    case 'Βεβαίωση με τα υπολειπόμενα μαθήματα για απόκτηση πτυχίου':
                        formData.VevaiosiRemainingLessons = data.requests[i].amount;
                        break;
                    case 'Αλλο':
                        formData.other = data.requests[i].amount;
                        formData.otherTxt = data.requests[i].what;
                        break;
                    default:
                        break;
                }
            }
        }
    }

    // build the request
    var option = {};
    option.url = this.department.url + this.department.request_url;
    (this.department === DEPART.MPES) ? option.formData = formData : option.form = formData;
    option.method = 'POST';
    option.headers = {'Cookie': cookie};
    option.encoding = 'binary';

    request(option, function (error, response, body) {
        if (error) {
            console.log('error:', error); // Print the error if one occurred
            return callback(error, null);
        }

        // parse charset
        var charset = charsetParser(body);

        // decode binary with charset
        var decodedBody = iconv.decode(body, charset);

        // parse html
        var document = new JSDOM(decodedBody);

        return callback(null, decodedBody)
    });

};

Parser.prototype.getDocument = function (cookie, callback) {
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
        var document = new JSDOM(decodedBody);

        return callback(null, document);
    });
}

// export the class
module.exports = Parser;
